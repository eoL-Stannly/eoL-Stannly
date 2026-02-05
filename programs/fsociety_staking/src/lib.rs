use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("FSoc1111111111111111111111111111111111111111");

/// Epoch duration in seconds (4 hours)
pub const EPOCH_DURATION: i64 = 4 * 60 * 60;

/// Lock period options in days
pub const LOCK_1_DAY: u8 = 1;
pub const LOCK_3_DAYS: u8 = 3;
pub const LOCK_5_DAYS: u8 = 5;

/// Reward multipliers (in basis points, 10000 = 1x, 11000 = 1.1x = +10%)
pub const MULTIPLIER_1_DAY: u64 = 11000;  // 1.1x (+10% bonus)
pub const MULTIPLIER_3_DAYS: u64 = 13500; // 1.35x (+35% bonus)
pub const MULTIPLIER_5_DAYS: u64 = 16000; // 1.6x (+60% bonus)

/// Base APR in basis points (adjustable by admin)
pub const DEFAULT_BASE_APR: u64 = 5000; // 50%

#[program]
pub mod fsociety_staking {
    use super::*;

    /// Initialize the staking pool
    pub fn initialize_pool(
        ctx: Context<InitializePool>,
        pool_name: String,
        base_apr: u64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.authority = ctx.accounts.authority.key();
        pool.lp_token_mint = ctx.accounts.lp_token_mint.key();
        pool.reward_token_mint = ctx.accounts.reward_token_mint.key();
        pool.pool_vault = ctx.accounts.pool_vault.key();
        pool.reward_vault = ctx.accounts.reward_vault.key();
        pool.pool_name = pool_name;
        pool.base_apr = base_apr;
        pool.total_staked = 0;
        pool.total_stakers = 0;
        pool.last_epoch = Clock::get()?.unix_timestamp / EPOCH_DURATION;
        pool.bump = ctx.bumps.pool;

        msg!("Staking pool initialized: {}", pool.pool_name);
        Ok(())
    }

    /// Stake LP tokens with a lock period
    pub fn stake(
        ctx: Context<Stake>,
        amount: u64,
        lock_days: u8,
    ) -> Result<()> {
        require!(amount > 0, StakingError::InvalidAmount);
        require!(
            lock_days == LOCK_1_DAY || lock_days == LOCK_3_DAYS || lock_days == LOCK_5_DAYS,
            StakingError::InvalidLockPeriod
        );

        let clock = Clock::get()?;
        let stake_account = &mut ctx.accounts.stake_account;
        let pool = &mut ctx.accounts.pool;

        // Calculate unlock time
        let lock_duration = (lock_days as i64) * 24 * 60 * 60;
        let unlock_time = clock.unix_timestamp + lock_duration;

        // Get reward multiplier
        let multiplier = match lock_days {
            LOCK_1_DAY => MULTIPLIER_1_DAY,
            LOCK_3_DAYS => MULTIPLIER_3_DAYS,
            LOCK_5_DAYS => MULTIPLIER_5_DAYS,
            _ => return Err(StakingError::InvalidLockPeriod.into()),
        };

        // Initialize or update stake account
        if stake_account.amount == 0 {
            pool.total_stakers += 1;
        }

        stake_account.owner = ctx.accounts.user.key();
        stake_account.pool = pool.key();
        stake_account.amount = stake_account.amount.checked_add(amount).unwrap();
        stake_account.lock_days = lock_days;
        stake_account.stake_time = clock.unix_timestamp;
        stake_account.unlock_time = unlock_time;
        stake_account.multiplier = multiplier;
        stake_account.last_claim_epoch = clock.unix_timestamp / EPOCH_DURATION;
        stake_account.pending_rewards = 0;
        stake_account.bump = ctx.bumps.stake_account;

        // Transfer LP tokens to pool vault
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_lp_account.to_account_info(),
            to: ctx.accounts.pool_vault.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        // Update pool stats
        pool.total_staked = pool.total_staked.checked_add(amount).unwrap();

        msg!(
            "Staked {} LP tokens for {} days (unlock at {})",
            amount,
            lock_days,
            unlock_time
        );
        Ok(())
    }

    /// Unstake LP tokens (only after lock period)
    pub fn unstake(ctx: Context<Unstake>) -> Result<()> {
        let clock = Clock::get()?;
        let stake_account = &ctx.accounts.stake_account;
        let pool = &ctx.accounts.pool;

        require!(stake_account.amount > 0, StakingError::NoStake);
        require!(
            clock.unix_timestamp >= stake_account.unlock_time,
            StakingError::StillLocked
        );

        let amount = stake_account.amount;

        // Transfer LP tokens back to user
        let pool_seeds = &[
            b"pool".as_ref(),
            pool.lp_token_mint.as_ref(),
            &[pool.bump],
        ];
        let signer_seeds = &[&pool_seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.pool_vault.to_account_info(),
            to: ctx.accounts.user_lp_account.to_account_info(),
            authority: ctx.accounts.pool.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        token::transfer(cpi_ctx, amount)?;

        // Update pool stats
        let pool = &mut ctx.accounts.pool;
        pool.total_staked = pool.total_staked.checked_sub(amount).unwrap();
        pool.total_stakers = pool.total_stakers.saturating_sub(1);

        // Reset stake account
        let stake_account = &mut ctx.accounts.stake_account;
        stake_account.amount = 0;

        msg!("Unstaked {} LP tokens", amount);
        Ok(())
    }

    /// Claim accumulated rewards (rebase mechanism)
    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        let clock = Clock::get()?;
        let current_epoch = clock.unix_timestamp / EPOCH_DURATION;
        let stake_account = &mut ctx.accounts.stake_account;
        let pool = &ctx.accounts.pool;

        require!(stake_account.amount > 0, StakingError::NoStake);

        // Calculate rewards based on epochs passed
        let epochs_passed = (current_epoch - stake_account.last_claim_epoch) as u64;
        if epochs_passed == 0 {
            return Err(StakingError::NoRewardsYet.into());
        }

        // Calculate reward per epoch (APR / epochs_per_year * multiplier)
        // epochs_per_year = 365 * 24 / 4 = 2190
        let epochs_per_year: u64 = 2190;
        let reward_per_epoch = stake_account
            .amount
            .checked_mul(pool.base_apr)
            .unwrap()
            .checked_mul(stake_account.multiplier)
            .unwrap()
            .checked_div(10000) // multiplier basis points
            .unwrap()
            .checked_div(10000) // apr basis points
            .unwrap()
            .checked_div(epochs_per_year)
            .unwrap();

        let total_rewards = reward_per_epoch.checked_mul(epochs_passed).unwrap();

        if total_rewards == 0 {
            return Err(StakingError::NoRewardsYet.into());
        }

        // Transfer rewards from reward vault
        let pool_seeds = &[
            b"pool".as_ref(),
            pool.lp_token_mint.as_ref(),
            &[pool.bump],
        ];
        let signer_seeds = &[&pool_seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.reward_vault.to_account_info(),
            to: ctx.accounts.user_reward_account.to_account_info(),
            authority: ctx.accounts.pool.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        token::transfer(cpi_ctx, total_rewards)?;

        // Update last claim epoch
        stake_account.last_claim_epoch = current_epoch;

        msg!(
            "Claimed {} reward tokens ({} epochs)",
            total_rewards,
            epochs_passed
        );
        Ok(())
    }

    /// Admin: Update base APR
    pub fn update_apr(ctx: Context<UpdatePool>, new_apr: u64) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.base_apr = new_apr;
        msg!("Updated base APR to {} basis points", new_apr);
        Ok(())
    }

    /// Admin: Deposit rewards to the pool
    pub fn deposit_rewards(ctx: Context<DepositRewards>, amount: u64) -> Result<()> {
        let cpi_accounts = Transfer {
            from: ctx.accounts.authority_reward_account.to_account_info(),
            to: ctx.accounts.reward_vault.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        msg!("Deposited {} reward tokens to pool", amount);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(pool_name: String)]
pub struct InitializePool<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + StakingPool::INIT_SPACE,
        seeds = [b"pool", lp_token_mint.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, StakingPool>,

    pub lp_token_mint: Account<'info, Mint>,
    pub reward_token_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = authority,
        token::mint = lp_token_mint,
        token::authority = pool,
        seeds = [b"pool_vault", pool.key().as_ref()],
        bump
    )]
    pub pool_vault: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = authority,
        token::mint = reward_token_mint,
        token::authority = pool,
        seeds = [b"reward_vault", pool.key().as_ref()],
        bump
    )]
    pub reward_vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(
        mut,
        seeds = [b"pool", pool.lp_token_mint.as_ref()],
        bump = pool.bump
    )]
    pub pool: Account<'info, StakingPool>,

    #[account(
        init_if_needed,
        payer = user,
        space = 8 + StakeAccount::INIT_SPACE,
        seeds = [b"stake", pool.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub stake_account: Account<'info, StakeAccount>,

    #[account(
        mut,
        constraint = pool_vault.key() == pool.pool_vault
    )]
    pub pool_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = user_lp_account.mint == pool.lp_token_mint,
        constraint = user_lp_account.owner == user.key()
    )]
    pub user_lp_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(
        mut,
        seeds = [b"pool", pool.lp_token_mint.as_ref()],
        bump = pool.bump
    )]
    pub pool: Account<'info, StakingPool>,

    #[account(
        mut,
        seeds = [b"stake", pool.key().as_ref(), user.key().as_ref()],
        bump = stake_account.bump,
        constraint = stake_account.owner == user.key()
    )]
    pub stake_account: Account<'info, StakeAccount>,

    #[account(
        mut,
        constraint = pool_vault.key() == pool.pool_vault
    )]
    pub pool_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = user_lp_account.mint == pool.lp_token_mint,
        constraint = user_lp_account.owner == user.key()
    )]
    pub user_lp_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(
        seeds = [b"pool", pool.lp_token_mint.as_ref()],
        bump = pool.bump
    )]
    pub pool: Account<'info, StakingPool>,

    #[account(
        mut,
        seeds = [b"stake", pool.key().as_ref(), user.key().as_ref()],
        bump = stake_account.bump,
        constraint = stake_account.owner == user.key()
    )]
    pub stake_account: Account<'info, StakeAccount>,

    #[account(
        mut,
        constraint = reward_vault.key() == pool.reward_vault
    )]
    pub reward_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = user_reward_account.mint == pool.reward_token_mint,
        constraint = user_reward_account.owner == user.key()
    )]
    pub user_reward_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdatePool<'info> {
    #[account(
        mut,
        seeds = [b"pool", pool.lp_token_mint.as_ref()],
        bump = pool.bump,
        constraint = pool.authority == authority.key()
    )]
    pub pool: Account<'info, StakingPool>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct DepositRewards<'info> {
    #[account(
        seeds = [b"pool", pool.lp_token_mint.as_ref()],
        bump = pool.bump,
        constraint = pool.authority == authority.key()
    )]
    pub pool: Account<'info, StakingPool>,

    #[account(
        mut,
        constraint = reward_vault.key() == pool.reward_vault
    )]
    pub reward_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = authority_reward_account.mint == pool.reward_token_mint,
        constraint = authority_reward_account.owner == authority.key()
    )]
    pub authority_reward_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[account]
#[derive(InitSpace)]
pub struct StakingPool {
    pub authority: Pubkey,
    pub lp_token_mint: Pubkey,
    pub reward_token_mint: Pubkey,
    pub pool_vault: Pubkey,
    pub reward_vault: Pubkey,
    #[max_len(32)]
    pub pool_name: String,
    pub base_apr: u64,
    pub total_staked: u64,
    pub total_stakers: u64,
    pub last_epoch: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct StakeAccount {
    pub owner: Pubkey,
    pub pool: Pubkey,
    pub amount: u64,
    pub lock_days: u8,
    pub stake_time: i64,
    pub unlock_time: i64,
    pub multiplier: u64,
    pub last_claim_epoch: i64,
    pub pending_rewards: u64,
    pub bump: u8,
}

#[error_code]
pub enum StakingError {
    #[msg("Invalid stake amount")]
    InvalidAmount,
    #[msg("Invalid lock period. Must be 1, 3, or 5 days")]
    InvalidLockPeriod,
    #[msg("No stake found")]
    NoStake,
    #[msg("Tokens are still locked")]
    StillLocked,
    #[msg("No rewards available yet")]
    NoRewardsYet,
}
