use anchor_lang::prelude::*;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer, CloseAccount};

declare_id!("FBond111111111111111111111111111111111111111");

/// Lock period options in days
pub const LOCK_1_DAY: u8 = 1;
pub const LOCK_3_DAYS: u8 = 3;
pub const LOCK_5_DAYS: u8 = 5;

/// Discount rates in basis points (100 = 1%)
pub const DISCOUNT_1_DAY: u64 = 1000;   // 10%
pub const DISCOUNT_3_DAYS: u64 = 3500;  // 35%
pub const DISCOUNT_5_DAYS: u64 = 6000;  // 60%

/// USDC decimals (6 on Solana)
pub const USDC_DECIMALS: u8 = 6;

/// $FSOC decimals (9, standard for Solana tokens)
pub const FSOC_DECIMALS: u8 = 9;

/// Minimum bond amount (prevent dust attacks)
pub const MIN_SOL_BOND: u64 = 10_000_000; // 0.01 SOL
pub const MIN_USDC_BOND: u64 = 1_000_000; // 1 USDC

/// Maximum bond per transaction (prevent whale attacks)
pub const MAX_SOL_BOND: u64 = 100 * LAMPORTS_PER_SOL; // 100 SOL
pub const MAX_USDC_BOND: u64 = 10_000_000_000; // 10,000 USDC

#[program]
pub mod fsociety_bonding {
    use super::*;

    /// Initialize the bonding treasury
    /// fsoc_price_usd: Price of $FSOC in micro-USD (6 decimals)
    pub fn initialize_treasury(
        ctx: Context<InitializeTreasury>,
        fsoc_price_usd: u64,
    ) -> Result<()> {
        let treasury = &mut ctx.accounts.treasury;
        treasury.authority = ctx.accounts.authority.key();
        treasury.fsoc_mint = ctx.accounts.fsoc_mint.key();
        treasury.usdc_mint = ctx.accounts.usdc_mint.key();
        treasury.fsoc_vault = ctx.accounts.fsoc_vault.key();
        treasury.usdc_vault = ctx.accounts.usdc_vault.key();
        treasury.sol_vault = ctx.accounts.sol_vault.key();
        treasury.fsoc_price_usd = fsoc_price_usd;
        treasury.sol_price_usd = 0; // Will be updated via oracle or admin
        treasury.total_bonds = 0;
        treasury.total_fsoc_bonded = 0;
        treasury.is_active = true;
        treasury.bump = ctx.bumps.treasury;
        treasury.sol_vault_bump = ctx.bumps.sol_vault;

        msg!("Bonding treasury initialized with $FSOC price: {} micro-USD", fsoc_price_usd);
        Ok(())
    }

    /// Admin: Update SOL price (should be called regularly or use oracle)
    /// In production, integrate with Pyth oracle for real-time price
    pub fn update_sol_price(ctx: Context<UpdateTreasury>, new_sol_price_usd: u64) -> Result<()> {
        require!(new_sol_price_usd > 0, BondingError::InvalidPrice);
        let treasury = &mut ctx.accounts.treasury;
        treasury.sol_price_usd = new_sol_price_usd;
        msg!("Updated SOL price to {} micro-USD (${:.2})", new_sol_price_usd, new_sol_price_usd as f64 / 1_000_000.0);
        Ok(())
    }

    /// Bond with SOL to receive discounted $FSOC
    pub fn bond_with_sol(
        ctx: Context<BondWithSol>,
        sol_amount: u64,
        lock_days: u8,
    ) -> Result<()> {
        let treasury = &ctx.accounts.treasury;

        require!(treasury.is_active, BondingError::TreasuryInactive);
        require!(sol_amount >= MIN_SOL_BOND, BondingError::BondTooSmall);
        require!(sol_amount <= MAX_SOL_BOND, BondingError::BondTooLarge);
        require!(treasury.sol_price_usd > 0, BondingError::SolPriceNotSet);
        require!(
            lock_days == LOCK_1_DAY || lock_days == LOCK_3_DAYS || lock_days == LOCK_5_DAYS,
            BondingError::InvalidLockPeriod
        );

        let clock = Clock::get()?;

        // Get discount based on lock period
        let discount = get_discount(lock_days)?;

        // Calculate $FSOC amount using admin-set SOL price
        // SOL value in USD = sol_amount * sol_price_usd / LAMPORTS_PER_SOL
        let sol_value_usd = sol_amount
            .checked_mul(treasury.sol_price_usd)
            .ok_or(BondingError::MathOverflow)?
            .checked_div(LAMPORTS_PER_SOL)
            .ok_or(BondingError::MathOverflow)?;

        // $FSOC amount = sol_value_usd / fsoc_price * (1 + discount/10000)
        let discount_multiplier = 10000u64.checked_add(discount).ok_or(BondingError::MathOverflow)?;
        let fsoc_amount = sol_value_usd
            .checked_mul(discount_multiplier)
            .ok_or(BondingError::MathOverflow)?
            .checked_mul(10u64.pow(FSOC_DECIMALS as u32))
            .ok_or(BondingError::MathOverflow)?
            .checked_div(treasury.fsoc_price_usd)
            .ok_or(BondingError::MathOverflow)?
            .checked_div(10000)
            .ok_or(BondingError::MathOverflow)?;

        // Check if vault has enough $FSOC
        let vault_balance = ctx.accounts.fsoc_vault.amount;
        require!(vault_balance >= fsoc_amount, BondingError::InsufficientVaultBalance);

        // Transfer SOL from user to treasury
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.user.key(),
            &ctx.accounts.sol_vault.key(),
            sol_amount,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.sol_vault.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        // Create bond record
        let bond = &mut ctx.accounts.bond;
        bond.owner = ctx.accounts.user.key();
        bond.treasury = treasury.key();
        bond.payment_amount = sol_amount;
        bond.payment_type = PaymentType::Sol;
        bond.fsoc_amount = fsoc_amount;
        bond.discount = discount;
        bond.lock_days = lock_days;
        bond.bond_time = clock.unix_timestamp;
        bond.unlock_time = clock.unix_timestamp + (lock_days as i64 * 24 * 60 * 60);
        bond.claimed = false;
        bond.bump = ctx.bumps.bond;

        // Update treasury stats
        let treasury = &mut ctx.accounts.treasury;
        treasury.total_bonds += 1;
        treasury.total_fsoc_bonded = treasury.total_fsoc_bonded
            .checked_add(fsoc_amount)
            .ok_or(BondingError::MathOverflow)?;

        msg!(
            "Bond created: {} SOL for {} $FSOC ({} bps discount, {} day lock)",
            sol_amount,
            fsoc_amount,
            discount,
            lock_days
        );
        Ok(())
    }

    /// Bond with USDC to receive discounted $FSOC
    pub fn bond_with_usdc(
        ctx: Context<BondWithUsdc>,
        usdc_amount: u64,
        lock_days: u8,
    ) -> Result<()> {
        let treasury = &ctx.accounts.treasury;

        require!(treasury.is_active, BondingError::TreasuryInactive);
        require!(usdc_amount >= MIN_USDC_BOND, BondingError::BondTooSmall);
        require!(usdc_amount <= MAX_USDC_BOND, BondingError::BondTooLarge);
        require!(
            lock_days == LOCK_1_DAY || lock_days == LOCK_3_DAYS || lock_days == LOCK_5_DAYS,
            BondingError::InvalidLockPeriod
        );

        let clock = Clock::get()?;

        // Get discount based on lock period
        let discount = get_discount(lock_days)?;

        // Calculate $FSOC amount
        // USDC has 6 decimals, so usdc_amount is already in micro-USD
        let discount_multiplier = 10000u64.checked_add(discount).ok_or(BondingError::MathOverflow)?;
        let fsoc_amount = usdc_amount
            .checked_mul(discount_multiplier)
            .ok_or(BondingError::MathOverflow)?
            .checked_mul(10u64.pow(FSOC_DECIMALS as u32))
            .ok_or(BondingError::MathOverflow)?
            .checked_div(treasury.fsoc_price_usd)
            .ok_or(BondingError::MathOverflow)?
            .checked_div(10000)
            .ok_or(BondingError::MathOverflow)?;

        // Check if vault has enough $FSOC
        let vault_balance = ctx.accounts.fsoc_vault.amount;
        require!(vault_balance >= fsoc_amount, BondingError::InsufficientVaultBalance);

        // Transfer USDC from user to treasury
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_usdc_account.to_account_info(),
            to: ctx.accounts.usdc_vault.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, usdc_amount)?;

        // Create bond record
        let bond = &mut ctx.accounts.bond;
        bond.owner = ctx.accounts.user.key();
        bond.treasury = treasury.key();
        bond.payment_amount = usdc_amount;
        bond.payment_type = PaymentType::Usdc;
        bond.fsoc_amount = fsoc_amount;
        bond.discount = discount;
        bond.lock_days = lock_days;
        bond.bond_time = clock.unix_timestamp;
        bond.unlock_time = clock.unix_timestamp + (lock_days as i64 * 24 * 60 * 60);
        bond.claimed = false;
        bond.bump = ctx.bumps.bond;

        // Update treasury stats
        let treasury = &mut ctx.accounts.treasury;
        treasury.total_bonds += 1;
        treasury.total_fsoc_bonded = treasury.total_fsoc_bonded
            .checked_add(fsoc_amount)
            .ok_or(BondingError::MathOverflow)?;

        msg!(
            "Bond created: {} USDC for {} $FSOC ({} bps discount, {} day lock)",
            usdc_amount,
            fsoc_amount,
            discount,
            lock_days
        );
        Ok(())
    }

    /// Claim vested $FSOC tokens after lock period
    /// Bond account is closed after claim, returning rent to user
    pub fn claim_bond(ctx: Context<ClaimBond>) -> Result<()> {
        let clock = Clock::get()?;
        let bond = &ctx.accounts.bond;
        let treasury = &ctx.accounts.treasury;

        require!(!bond.claimed, BondingError::AlreadyClaimed);
        require!(
            clock.unix_timestamp >= bond.unlock_time,
            BondingError::StillVesting
        );

        let fsoc_amount = bond.fsoc_amount;

        // Verify vault has sufficient balance
        let vault_balance = ctx.accounts.fsoc_vault.amount;
        require!(vault_balance >= fsoc_amount, BondingError::InsufficientVaultBalance);

        // Transfer $FSOC from treasury vault to user
        let treasury_seeds = &[
            b"treasury".as_ref(),
            treasury.fsoc_mint.as_ref(),
            &[treasury.bump],
        ];
        let signer_seeds = &[&treasury_seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.fsoc_vault.to_account_info(),
            to: ctx.accounts.user_fsoc_account.to_account_info(),
            authority: ctx.accounts.treasury.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        token::transfer(cpi_ctx, fsoc_amount)?;

        // Mark bond as claimed (account will be closed below)
        let bond = &mut ctx.accounts.bond;
        bond.claimed = true;

        msg!("Claimed {} $FSOC from bond", fsoc_amount);
        Ok(())
    }

    /// Admin: Update $FSOC price
    pub fn update_fsoc_price(ctx: Context<UpdateTreasury>, new_price: u64) -> Result<()> {
        require!(new_price > 0, BondingError::InvalidPrice);
        let treasury = &mut ctx.accounts.treasury;
        treasury.fsoc_price_usd = new_price;
        msg!("Updated $FSOC price to {} micro-USD", new_price);
        Ok(())
    }

    /// Admin: Toggle treasury active status
    pub fn toggle_treasury(ctx: Context<UpdateTreasury>) -> Result<()> {
        let treasury = &mut ctx.accounts.treasury;
        treasury.is_active = !treasury.is_active;
        msg!("Treasury active status: {}", treasury.is_active);
        Ok(())
    }

    /// Admin: Deposit $FSOC tokens to treasury
    pub fn deposit_fsoc(ctx: Context<DepositFsoc>, amount: u64) -> Result<()> {
        let cpi_accounts = Transfer {
            from: ctx.accounts.authority_fsoc_account.to_account_info(),
            to: ctx.accounts.fsoc_vault.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        msg!("Deposited {} $FSOC to treasury", amount);
        Ok(())
    }

    /// Admin: Withdraw SOL from treasury
    pub fn withdraw_sol(ctx: Context<WithdrawSol>, amount: u64) -> Result<()> {
        let treasury = &ctx.accounts.treasury;

        // Get SOL vault balance
        let sol_vault_balance = ctx.accounts.sol_vault.lamports();
        require!(sol_vault_balance >= amount, BondingError::InsufficientVaultBalance);

        // Transfer SOL from vault to authority
        let treasury_seeds = &[
            b"treasury".as_ref(),
            treasury.fsoc_mint.as_ref(),
            &[treasury.bump],
        ];

        let sol_vault_seeds = &[
            b"sol_vault".as_ref(),
            treasury.key().as_ref(),
            &[treasury.sol_vault_bump],
        ];
        let signer_seeds = &[&sol_vault_seeds[..]];

        // Transfer using system program
        **ctx.accounts.sol_vault.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.authority.to_account_info().try_borrow_mut_lamports()? += amount;

        msg!("Withdrawn {} SOL from treasury", amount);
        Ok(())
    }

    /// Admin: Withdraw USDC from treasury
    pub fn withdraw_usdc(ctx: Context<WithdrawUsdc>, amount: u64) -> Result<()> {
        let treasury = &ctx.accounts.treasury;

        // Verify vault has sufficient balance
        let vault_balance = ctx.accounts.usdc_vault.amount;
        require!(vault_balance >= amount, BondingError::InsufficientVaultBalance);

        // Transfer USDC from vault to authority
        let treasury_seeds = &[
            b"treasury".as_ref(),
            treasury.fsoc_mint.as_ref(),
            &[treasury.bump],
        ];
        let signer_seeds = &[&treasury_seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.usdc_vault.to_account_info(),
            to: ctx.accounts.authority_usdc_account.to_account_info(),
            authority: ctx.accounts.treasury.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        token::transfer(cpi_ctx, amount)?;

        msg!("Withdrawn {} USDC from treasury", amount);
        Ok(())
    }

    /// Admin: Withdraw excess $FSOC from treasury
    pub fn withdraw_fsoc(ctx: Context<WithdrawFsoc>, amount: u64) -> Result<()> {
        let treasury = &ctx.accounts.treasury;

        // Verify vault has sufficient balance
        let vault_balance = ctx.accounts.fsoc_vault.amount;
        require!(vault_balance >= amount, BondingError::InsufficientVaultBalance);

        // Transfer $FSOC from vault to authority
        let treasury_seeds = &[
            b"treasury".as_ref(),
            treasury.fsoc_mint.as_ref(),
            &[treasury.bump],
        ];
        let signer_seeds = &[&treasury_seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.fsoc_vault.to_account_info(),
            to: ctx.accounts.authority_fsoc_account.to_account_info(),
            authority: ctx.accounts.treasury.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        token::transfer(cpi_ctx, amount)?;

        msg!("Withdrawn {} $FSOC from treasury", amount);
        Ok(())
    }
}

fn get_discount(lock_days: u8) -> Result<u64> {
    match lock_days {
        LOCK_1_DAY => Ok(DISCOUNT_1_DAY),
        LOCK_3_DAYS => Ok(DISCOUNT_3_DAYS),
        LOCK_5_DAYS => Ok(DISCOUNT_5_DAYS),
        _ => Err(BondingError::InvalidLockPeriod.into()),
    }
}

#[derive(Accounts)]
pub struct InitializeTreasury<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + BondingTreasury::INIT_SPACE,
        seeds = [b"treasury", fsoc_mint.key().as_ref()],
        bump
    )]
    pub treasury: Account<'info, BondingTreasury>,

    pub fsoc_mint: Account<'info, Mint>,
    pub usdc_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = authority,
        token::mint = fsoc_mint,
        token::authority = treasury,
        seeds = [b"fsoc_vault", treasury.key().as_ref()],
        bump
    )]
    pub fsoc_vault: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = authority,
        token::mint = usdc_mint,
        token::authority = treasury,
        seeds = [b"usdc_vault", treasury.key().as_ref()],
        bump
    )]
    pub usdc_vault: Account<'info, TokenAccount>,

    /// CHECK: SOL vault is just a PDA that holds SOL
    #[account(
        mut,
        seeds = [b"sol_vault", treasury.key().as_ref()],
        bump
    )]
    pub sol_vault: AccountInfo<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct BondWithSol<'info> {
    #[account(
        mut,
        seeds = [b"treasury", treasury.fsoc_mint.as_ref()],
        bump = treasury.bump
    )]
    pub treasury: Account<'info, BondingTreasury>,

    #[account(
        init,
        payer = user,
        space = 8 + Bond::INIT_SPACE,
        seeds = [b"bond", treasury.key().as_ref(), user.key().as_ref(), &treasury.total_bonds.to_le_bytes()],
        bump
    )]
    pub bond: Account<'info, Bond>,

    #[account(
        constraint = fsoc_vault.key() == treasury.fsoc_vault
    )]
    pub fsoc_vault: Account<'info, TokenAccount>,

    /// CHECK: SOL vault PDA
    #[account(
        mut,
        seeds = [b"sol_vault", treasury.key().as_ref()],
        bump
    )]
    pub sol_vault: AccountInfo<'info>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BondWithUsdc<'info> {
    #[account(
        mut,
        seeds = [b"treasury", treasury.fsoc_mint.as_ref()],
        bump = treasury.bump
    )]
    pub treasury: Account<'info, BondingTreasury>,

    #[account(
        init,
        payer = user,
        space = 8 + Bond::INIT_SPACE,
        seeds = [b"bond", treasury.key().as_ref(), user.key().as_ref(), &treasury.total_bonds.to_le_bytes()],
        bump
    )]
    pub bond: Account<'info, Bond>,

    #[account(
        constraint = fsoc_vault.key() == treasury.fsoc_vault
    )]
    pub fsoc_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = usdc_vault.key() == treasury.usdc_vault
    )]
    pub usdc_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = user_usdc_account.mint == treasury.usdc_mint,
        constraint = user_usdc_account.owner == user.key()
    )]
    pub user_usdc_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ClaimBond<'info> {
    #[account(
        seeds = [b"treasury", treasury.fsoc_mint.as_ref()],
        bump = treasury.bump
    )]
    pub treasury: Account<'info, BondingTreasury>,

    #[account(
        mut,
        close = user,
        constraint = bond.owner == user.key(),
        constraint = bond.treasury == treasury.key()
    )]
    pub bond: Account<'info, Bond>,

    #[account(
        mut,
        constraint = fsoc_vault.key() == treasury.fsoc_vault
    )]
    pub fsoc_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = user_fsoc_account.mint == treasury.fsoc_mint,
        constraint = user_fsoc_account.owner == user.key()
    )]
    pub user_fsoc_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdateTreasury<'info> {
    #[account(
        mut,
        seeds = [b"treasury", treasury.fsoc_mint.as_ref()],
        bump = treasury.bump,
        constraint = treasury.authority == authority.key()
    )]
    pub treasury: Account<'info, BondingTreasury>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct DepositFsoc<'info> {
    #[account(
        seeds = [b"treasury", treasury.fsoc_mint.as_ref()],
        bump = treasury.bump,
        constraint = treasury.authority == authority.key()
    )]
    pub treasury: Account<'info, BondingTreasury>,

    #[account(
        mut,
        constraint = fsoc_vault.key() == treasury.fsoc_vault
    )]
    pub fsoc_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = authority_fsoc_account.mint == treasury.fsoc_mint,
        constraint = authority_fsoc_account.owner == authority.key()
    )]
    pub authority_fsoc_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct WithdrawSol<'info> {
    #[account(
        seeds = [b"treasury", treasury.fsoc_mint.as_ref()],
        bump = treasury.bump,
        constraint = treasury.authority == authority.key()
    )]
    pub treasury: Account<'info, BondingTreasury>,

    /// CHECK: SOL vault PDA
    #[account(
        mut,
        seeds = [b"sol_vault", treasury.key().as_ref()],
        bump = treasury.sol_vault_bump
    )]
    pub sol_vault: AccountInfo<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawUsdc<'info> {
    #[account(
        seeds = [b"treasury", treasury.fsoc_mint.as_ref()],
        bump = treasury.bump,
        constraint = treasury.authority == authority.key()
    )]
    pub treasury: Account<'info, BondingTreasury>,

    #[account(
        mut,
        constraint = usdc_vault.key() == treasury.usdc_vault
    )]
    pub usdc_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = authority_usdc_account.mint == treasury.usdc_mint,
        constraint = authority_usdc_account.owner == authority.key()
    )]
    pub authority_usdc_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct WithdrawFsoc<'info> {
    #[account(
        seeds = [b"treasury", treasury.fsoc_mint.as_ref()],
        bump = treasury.bump,
        constraint = treasury.authority == authority.key()
    )]
    pub treasury: Account<'info, BondingTreasury>,

    #[account(
        mut,
        constraint = fsoc_vault.key() == treasury.fsoc_vault
    )]
    pub fsoc_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = authority_fsoc_account.mint == treasury.fsoc_mint,
        constraint = authority_fsoc_account.owner == authority.key()
    )]
    pub authority_fsoc_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[account]
#[derive(InitSpace)]
pub struct BondingTreasury {
    pub authority: Pubkey,
    pub fsoc_mint: Pubkey,          // $FSOC token mint
    pub usdc_mint: Pubkey,
    pub fsoc_vault: Pubkey,
    pub usdc_vault: Pubkey,
    pub sol_vault: Pubkey,
    pub fsoc_price_usd: u64,        // Price in micro-USD (6 decimals)
    pub sol_price_usd: u64,         // SOL price in micro-USD (updated by admin/oracle)
    pub total_bonds: u64,
    pub total_fsoc_bonded: u64,
    pub is_active: bool,
    pub bump: u8,
    pub sol_vault_bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Bond {
    pub owner: Pubkey,
    pub treasury: Pubkey,
    pub payment_amount: u64,
    pub payment_type: PaymentType,
    pub fsoc_amount: u64,           // Amount of $FSOC to receive
    pub discount: u64,
    pub lock_days: u8,
    pub bond_time: i64,
    pub unlock_time: i64,
    pub claimed: bool,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum PaymentType {
    Sol,
    Usdc,
}

#[error_code]
pub enum BondingError {
    #[msg("Invalid bond amount")]
    InvalidAmount,
    #[msg("Invalid lock period. Must be 1, 3, or 5 days")]
    InvalidLockPeriod,
    #[msg("Treasury is currently inactive")]
    TreasuryInactive,
    #[msg("Bond is still vesting")]
    StillVesting,
    #[msg("Bond has already been claimed")]
    AlreadyClaimed,
    #[msg("Bond amount too small")]
    BondTooSmall,
    #[msg("Bond amount too large")]
    BondTooLarge,
    #[msg("Insufficient $FSOC balance in vault")]
    InsufficientVaultBalance,
    #[msg("SOL price not set - admin must update price")]
    SolPriceNotSet,
    #[msg("Invalid price")]
    InvalidPrice,
    #[msg("Math overflow")]
    MathOverflow,
}
