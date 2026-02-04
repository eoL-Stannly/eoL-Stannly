use anchor_lang::prelude::*;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

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

/// SHARK decimals (assumed 9, standard for Solana tokens)
pub const SHARK_DECIMALS: u8 = 9;

#[program]
pub mod fsociety_bonding {
    use super::*;

    /// Initialize the bonding treasury
    pub fn initialize_treasury(
        ctx: Context<InitializeTreasury>,
        shark_price_usd: u64, // Price in micro-USD (6 decimals)
    ) -> Result<()> {
        let treasury = &mut ctx.accounts.treasury;
        treasury.authority = ctx.accounts.authority.key();
        treasury.shark_mint = ctx.accounts.shark_mint.key();
        treasury.usdc_mint = ctx.accounts.usdc_mint.key();
        treasury.shark_vault = ctx.accounts.shark_vault.key();
        treasury.usdc_vault = ctx.accounts.usdc_vault.key();
        treasury.sol_vault = ctx.accounts.sol_vault.key();
        treasury.shark_price_usd = shark_price_usd;
        treasury.total_bonds = 0;
        treasury.total_shark_bonded = 0;
        treasury.is_active = true;
        treasury.bump = ctx.bumps.treasury;

        msg!("Bonding treasury initialized with SHARK price: {} micro-USD", shark_price_usd);
        Ok(())
    }

    /// Bond with SOL to receive discounted SHARK
    pub fn bond_with_sol(
        ctx: Context<BondWithSol>,
        sol_amount: u64,
        lock_days: u8,
    ) -> Result<()> {
        let treasury = &ctx.accounts.treasury;

        require!(treasury.is_active, BondingError::TreasuryInactive);
        require!(sol_amount > 0, BondingError::InvalidAmount);
        require!(
            lock_days == LOCK_1_DAY || lock_days == LOCK_3_DAYS || lock_days == LOCK_5_DAYS,
            BondingError::InvalidLockPeriod
        );

        let clock = Clock::get()?;

        // Get discount based on lock period
        let discount = get_discount(lock_days)?;

        // Calculate SHARK amount
        // SOL value in USD = sol_amount * sol_price / LAMPORTS_PER_SOL
        // For simplicity, we use a mock SOL price (should come from oracle in production)
        let sol_price_usd: u64 = 180_000_000; // $180 in micro-USD
        let sol_value_usd = sol_amount
            .checked_mul(sol_price_usd)
            .unwrap()
            .checked_div(LAMPORTS_PER_SOL)
            .unwrap();

        // SHARK amount = sol_value_usd / shark_price * (1 + discount/10000)
        let discount_multiplier = 10000u64.checked_add(discount).unwrap();
        let shark_amount = sol_value_usd
            .checked_mul(discount_multiplier)
            .unwrap()
            .checked_mul(10u64.pow(SHARK_DECIMALS as u32))
            .unwrap()
            .checked_div(treasury.shark_price_usd)
            .unwrap()
            .checked_div(10000)
            .unwrap();

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
        bond.shark_amount = shark_amount;
        bond.discount = discount;
        bond.lock_days = lock_days;
        bond.bond_time = clock.unix_timestamp;
        bond.unlock_time = clock.unix_timestamp + (lock_days as i64 * 24 * 60 * 60);
        bond.claimed = false;
        bond.bump = ctx.bumps.bond;

        // Update treasury stats
        let treasury = &mut ctx.accounts.treasury;
        treasury.total_bonds += 1;
        treasury.total_shark_bonded = treasury.total_shark_bonded.checked_add(shark_amount).unwrap();

        msg!(
            "Bond created: {} SOL for {} SHARK ({} bps discount, {} day lock)",
            sol_amount,
            shark_amount,
            discount,
            lock_days
        );
        Ok(())
    }

    /// Bond with USDC to receive discounted SHARK
    pub fn bond_with_usdc(
        ctx: Context<BondWithUsdc>,
        usdc_amount: u64,
        lock_days: u8,
    ) -> Result<()> {
        let treasury = &ctx.accounts.treasury;

        require!(treasury.is_active, BondingError::TreasuryInactive);
        require!(usdc_amount > 0, BondingError::InvalidAmount);
        require!(
            lock_days == LOCK_1_DAY || lock_days == LOCK_3_DAYS || lock_days == LOCK_5_DAYS,
            BondingError::InvalidLockPeriod
        );

        let clock = Clock::get()?;

        // Get discount based on lock period
        let discount = get_discount(lock_days)?;

        // Calculate SHARK amount
        // USDC has 6 decimals, so usdc_amount is already in micro-USD
        let discount_multiplier = 10000u64.checked_add(discount).unwrap();
        let shark_amount = usdc_amount
            .checked_mul(discount_multiplier)
            .unwrap()
            .checked_mul(10u64.pow(SHARK_DECIMALS as u32))
            .unwrap()
            .checked_div(treasury.shark_price_usd)
            .unwrap()
            .checked_div(10000)
            .unwrap();

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
        bond.shark_amount = shark_amount;
        bond.discount = discount;
        bond.lock_days = lock_days;
        bond.bond_time = clock.unix_timestamp;
        bond.unlock_time = clock.unix_timestamp + (lock_days as i64 * 24 * 60 * 60);
        bond.claimed = false;
        bond.bump = ctx.bumps.bond;

        // Update treasury stats
        let treasury = &mut ctx.accounts.treasury;
        treasury.total_bonds += 1;
        treasury.total_shark_bonded = treasury.total_shark_bonded.checked_add(shark_amount).unwrap();

        msg!(
            "Bond created: {} USDC for {} SHARK ({} bps discount, {} day lock)",
            usdc_amount,
            shark_amount,
            discount,
            lock_days
        );
        Ok(())
    }

    /// Claim vested SHARK tokens after lock period
    pub fn claim_bond(ctx: Context<ClaimBond>) -> Result<()> {
        let clock = Clock::get()?;
        let bond = &ctx.accounts.bond;
        let treasury = &ctx.accounts.treasury;

        require!(!bond.claimed, BondingError::AlreadyClaimed);
        require!(
            clock.unix_timestamp >= bond.unlock_time,
            BondingError::StillVesting
        );

        let shark_amount = bond.shark_amount;

        // Transfer SHARK from treasury vault to user
        let treasury_seeds = &[
            b"treasury".as_ref(),
            treasury.shark_mint.as_ref(),
            &[treasury.bump],
        ];
        let signer_seeds = &[&treasury_seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.shark_vault.to_account_info(),
            to: ctx.accounts.user_shark_account.to_account_info(),
            authority: ctx.accounts.treasury.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        token::transfer(cpi_ctx, shark_amount)?;

        // Mark bond as claimed
        let bond = &mut ctx.accounts.bond;
        bond.claimed = true;

        msg!("Claimed {} SHARK from bond", shark_amount);
        Ok(())
    }

    /// Admin: Update SHARK price
    pub fn update_shark_price(ctx: Context<UpdateTreasury>, new_price: u64) -> Result<()> {
        let treasury = &mut ctx.accounts.treasury;
        treasury.shark_price_usd = new_price;
        msg!("Updated SHARK price to {} micro-USD", new_price);
        Ok(())
    }

    /// Admin: Toggle treasury active status
    pub fn toggle_treasury(ctx: Context<UpdateTreasury>) -> Result<()> {
        let treasury = &mut ctx.accounts.treasury;
        treasury.is_active = !treasury.is_active;
        msg!("Treasury active status: {}", treasury.is_active);
        Ok(())
    }

    /// Admin: Deposit SHARK tokens to treasury
    pub fn deposit_shark(ctx: Context<DepositShark>, amount: u64) -> Result<()> {
        let cpi_accounts = Transfer {
            from: ctx.accounts.authority_shark_account.to_account_info(),
            to: ctx.accounts.shark_vault.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        msg!("Deposited {} SHARK to treasury", amount);
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
        seeds = [b"treasury", shark_mint.key().as_ref()],
        bump
    )]
    pub treasury: Account<'info, BondingTreasury>,

    pub shark_mint: Account<'info, Mint>,
    pub usdc_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = authority,
        token::mint = shark_mint,
        token::authority = treasury,
        seeds = [b"shark_vault", treasury.key().as_ref()],
        bump
    )]
    pub shark_vault: Account<'info, TokenAccount>,

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
        seeds = [b"treasury", treasury.shark_mint.as_ref()],
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
        seeds = [b"treasury", treasury.shark_mint.as_ref()],
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
        seeds = [b"treasury", treasury.shark_mint.as_ref()],
        bump = treasury.bump
    )]
    pub treasury: Account<'info, BondingTreasury>,

    #[account(
        mut,
        constraint = bond.owner == user.key(),
        constraint = bond.treasury == treasury.key()
    )]
    pub bond: Account<'info, Bond>,

    #[account(
        mut,
        constraint = shark_vault.key() == treasury.shark_vault
    )]
    pub shark_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = user_shark_account.mint == treasury.shark_mint,
        constraint = user_shark_account.owner == user.key()
    )]
    pub user_shark_account: Account<'info, TokenAccount>,

    pub user: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdateTreasury<'info> {
    #[account(
        mut,
        seeds = [b"treasury", treasury.shark_mint.as_ref()],
        bump = treasury.bump,
        constraint = treasury.authority == authority.key()
    )]
    pub treasury: Account<'info, BondingTreasury>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct DepositShark<'info> {
    #[account(
        seeds = [b"treasury", treasury.shark_mint.as_ref()],
        bump = treasury.bump,
        constraint = treasury.authority == authority.key()
    )]
    pub treasury: Account<'info, BondingTreasury>,

    #[account(
        mut,
        constraint = shark_vault.key() == treasury.shark_vault
    )]
    pub shark_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = authority_shark_account.mint == treasury.shark_mint,
        constraint = authority_shark_account.owner == authority.key()
    )]
    pub authority_shark_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[account]
#[derive(InitSpace)]
pub struct BondingTreasury {
    pub authority: Pubkey,
    pub shark_mint: Pubkey,
    pub usdc_mint: Pubkey,
    pub shark_vault: Pubkey,
    pub usdc_vault: Pubkey,
    pub sol_vault: Pubkey,
    pub shark_price_usd: u64, // Price in micro-USD (6 decimals)
    pub total_bonds: u64,
    pub total_shark_bonded: u64,
    pub is_active: bool,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Bond {
    pub owner: Pubkey,
    pub treasury: Pubkey,
    pub payment_amount: u64,
    pub payment_type: PaymentType,
    pub shark_amount: u64,
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
}
