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

/// Minimum stake amount (prevent dust attacks) - 1 $sFSOC with 9 decimals
pub const MIN_STAKE_AMOUNT: u64 = 1_000_000_000;

/// Epochs per year for reward calculation
pub const EPOCHS_PER_YEAR: u64 = 2190; // 365 * 24 / 4

/// Basis points denominator
pub const BASIS_POINTS: u64 = 10000;

#[program]
pub mod fsociety_staking {
    use super::*;

    /// Initialize the staking pool
    /// lp_token_mint: $sFSOC (share token that users stake)
    /// reward_token_mint: $FSOC (reward token users earn)
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
        pool.paused = false;
        pool.bump = ctx.bumps.pool;

        msg!("Staking pool initialized: {}", pool.pool_name);
        msg!("Stake $sFSOC to earn $FSOC rewards");
        Ok(())
    }

    /// Stake $sFSOC tokens with a lock period
    /// NOTE: Users must claim rewards before staking additional tokens
    pub fn stake(
        ctx: Context<Stake>,
        amount: u64,
        lock_days: u8,
    ) -> Result<()> {
        let pool = &ctx.accounts.pool;
        require!(!pool.paused, StakingError::PoolPaused);
        require!(amount >= MIN_STAKE_AMOUNT, StakingError::StakeTooSmall);
        require!(
            lock_days == LOCK_1_DAY || lock_days == LOCK_3_DAYS || lock_days == LOCK_5_DAYS,
            StakingError::InvalidLockPeriod
        );

        let clock = Clock::get()?;
        let stake_account = &mut ctx.accounts.stake_account;
        let pool = &mut ctx.accounts.pool;

        // Get reward multiplier
        let multiplier = match lock_days {
            LOCK_1_DAY => MULTIPLIER_1_DAY,
            LOCK_3_DAYS => MULTIPLIER_3_DAYS,
            LOCK_5_DAYS => MULTIPLIER_5_DAYS,
            _ => return Err(StakingError::InvalidLockPeriod.into()),
        };

        // Check if this is a new stake or additional deposit
        let is_new_stake = stake_account.amount == 0;

        if is_new_stake {
            // New stake - initialize everything
            pool.total_stakers = pool.total_stakers.checked_add(1).ok_or(StakingError::MathOverflow)?;

            let lock_duration = (lock_days as i64) * 24 * 60 * 60;

            stake_account.owner = ctx.accounts.user.key();
            stake_account.pool = pool.key();
            stake_account.amount = amount;
            stake_account.lock_days = lock_days;
            stake_account.stake_time = clock.unix_timestamp;
            stake_account.unlock_time = clock.unix_timestamp + lock_duration;
            stake_account.multiplier = multiplier;
            stake_account.last_claim_epoch = clock.unix_timestamp / EPOCH_DURATION;
            stake_account.accumulated_rewards = 0;
            stake_account.bump = ctx.bumps.stake_account;
        } else {
            // Additional deposit - user must claim first to avoid losing rewards
            // Check if there are unclaimed rewards
            let current_epoch = clock.unix_timestamp / EPOCH_DURATION;
            let epochs_passed = current_epoch - stake_account.last_claim_epoch;

            require!(
                epochs_passed == 0,
                StakingError::MustClaimBeforeAdditionalStake
            );

            // Extend lock period if new lock is longer
            let new_lock_duration = (lock_days as i64) * 24 * 60 * 60;
            let new_unlock_time = clock.unix_timestamp + new_lock_duration;

            // Use the longer lock period and higher multiplier
            if new_unlock_time > stake_account.unlock_time {
                stake_account.unlock_time = new_unlock_time;
                stake_account.lock_days = lock_days;
            }
            if multiplier > stake_account.multiplier {
                stake_account.multiplier = multiplier;
            }

            stake_account.amount = stake_account.amount.checked_add(amount).ok_or(StakingError::MathOverflow)?;
        }

        // Transfer $sFSOC tokens to pool vault
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_lp_account.to_account_info(),
            to: ctx.accounts.pool_vault.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        // Update pool stats
        pool.total_staked = pool.total_staked.checked_add(amount).ok_or(StakingError::MathOverflow)?;

        msg!(
            "Staked {} $sFSOC for {} days (unlock at {})",
            amount,
            stake_account.lock_days,
            stake_account.unlock_time
        );
        Ok(())
    }

    /// Unstake $sFSOC tokens (only after lock period)
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

        // Transfer $sFSOC tokens back to user
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
        pool.total_staked = pool.total_staked.checked_sub(amount).ok_or(StakingError::MathOverflow)?;
        pool.total_stakers = pool.total_stakers.saturating_sub(1);

        // Reset stake account
        let stake_account = &mut ctx.accounts.stake_account;
        stake_account.amount = 0;
        stake_account.accumulated_rewards = 0;

        msg!("Unstaked {} $sFSOC", amount);
        Ok(())
    }

    /// Claim accumulated $FSOC rewards (rebase mechanism)
    /// Rewards are based on epochs passed since last claim
    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        let clock = Clock::get()?;
        let current_epoch = clock.unix_timestamp / EPOCH_DURATION;
        let stake_account = &mut ctx.accounts.stake_account;
        let pool = &ctx.accounts.pool;

        require!(!pool.paused, StakingError::PoolPaused);
        require!(stake_account.amount > 0, StakingError::NoStake);

        // Calculate rewards based on epochs passed
        let epochs_passed = (current_epoch - stake_account.last_claim_epoch) as u64;
        if epochs_passed == 0 {
            return Err(StakingError::NoRewardsYet.into());
        }

        // Calculate reward with improved precision
        // Formula: (staked * base_apr * multiplier * epochs) / (BASIS_POINTS * BASIS_POINTS * EPOCHS_PER_YEAR)
        // Multiply all numerators first to avoid precision loss
        let numerator = stake_account.amount
            .checked_mul(pool.base_apr).ok_or(StakingError::MathOverflow)?
            .checked_mul(stake_account.multiplier).ok_or(StakingError::MathOverflow)?
            .checked_mul(epochs_passed).ok_or(StakingError::MathOverflow)?;

        // Single division at the end for better precision
        let denominator = BASIS_POINTS
            .checked_mul(BASIS_POINTS).ok_or(StakingError::MathOverflow)?
            .checked_mul(EPOCHS_PER_YEAR).ok_or(StakingError::MathOverflow)?;

        let total_rewards = numerator
            .checked_div(denominator).ok_or(StakingError::MathOverflow)?;

        if total_rewards == 0 {
            return Err(StakingError::NoRewardsYet.into());
        }

        // Check if reward vault has sufficient $FSOC balance
        let reward_vault_balance = ctx.accounts.reward_vault.amount;
        require!(
            reward_vault_balance >= total_rewards,
            StakingError::InsufficientRewardBalance
        );

        // Transfer $FSOC rewards from reward vault
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
        stake_account.accumulated_rewards = stake_account.accumulated_rewards
            .checked_add(total_rewards).ok_or(StakingError::MathOverflow)?;

        msg!(
            "Claimed {} $FSOC ({} epochs)",
            total_rewards,
            epochs_passed
        );
        Ok(())
    }

    /// Emergency withdraw - allows users to withdraw $sFSOC even during lock
    /// Forfeits any unclaimed $FSOC rewards
    pub fn emergency_withdraw(ctx: Context<EmergencyWithdraw>) -> Result<()> {
        let stake_account = &ctx.accounts.stake_account;
        let pool = &ctx.accounts.pool;

        require!(stake_account.amount > 0, StakingError::NoStake);

        let amount = stake_account.amount;

        // Transfer $sFSOC tokens back to user
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
        pool.total_staked = pool.total_staked.saturating_sub(amount);
        pool.total_stakers = pool.total_stakers.saturating_sub(1);

        // Reset stake account
        let stake_account = &mut ctx.accounts.stake_account;
        stake_account.amount = 0;
        stake_account.accumulated_rewards = 0;

        msg!("Emergency withdraw: {} $sFSOC ($FSOC rewards forfeited)", amount);
        Ok(())
    }

    /// Admin: Update base APR
    pub fn update_apr(ctx: Context<UpdatePool>, new_apr: u64) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.base_apr = new_apr;
        msg!("Updated base APR to {} basis points", new_apr);
        Ok(())
    }

    /// Admin: Pause/unpause the pool
    pub fn toggle_pause(ctx: Context<UpdatePool>) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.paused = !pool.paused;
        msg!("Pool paused status: {}", pool.paused);
        Ok(())
    }

    /// Admin: Deposit $FSOC rewards to the pool
    pub fn deposit_rewards(ctx: Context<DepositRewards>, amount: u64) -> Result<()> {
        let cpi_accounts = Transfer {
            from: ctx.accounts.authority_reward_account.to_account_info(),
            to: ctx.accounts.reward_vault.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        msg!("Deposited {} $FSOC rewards to pool", amount);
        Ok(())
    }

    /// Admin: Withdraw excess $FSOC rewards from the pool
    pub fn withdraw_rewards(ctx: Context<WithdrawRewards>, amount: u64) -> Result<()> {
        let pool = &ctx.accounts.pool;

        // Verify vault has sufficient balance
        let vault_balance = ctx.accounts.reward_vault.amount;
        require!(vault_balance >= amount, StakingError::InsufficientRewardBalance);

        // Transfer $FSOC from reward vault to authority
        let pool_seeds = &[
            b"pool".as_ref(),
            pool.lp_token_mint.as_ref(),
            &[pool.bump],
        ];
        let signer_seeds = &[&pool_seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.reward_vault.to_account_info(),
            to: ctx.accounts.authority_reward_account.to_account_info(),
            authority: ctx.accounts.pool.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        token::transfer(cpi_ctx, amount)?;

        msg!("Withdrawn {} $FSOC rewards from pool", amount);
        Ok(())
    }

    /// View function: Calculate pending $FSOC rewards for a user
    pub fn get_pending_rewards(ctx: Context<GetPendingRewards>) -> Result<u64> {
        let clock = Clock::get()?;
        let current_epoch = clock.unix_timestamp / EPOCH_DURATION;
        let stake_account = &ctx.accounts.stake_account;
        let pool = &ctx.accounts.pool;

        if stake_account.amount == 0 {
            return Ok(0);
        }

        let epochs_passed = (current_epoch - stake_account.last_claim_epoch) as u64;
        if epochs_passed == 0 {
            return Ok(0);
        }

        // Same formula as claim_rewards for consistency
        let numerator = stake_account.amount
            .checked_mul(pool.base_apr).unwrap_or(0)
            .checked_mul(stake_account.multiplier).unwrap_or(0)
            .checked_mul(epochs_passed).unwrap_or(0);

        let denominator = BASIS_POINTS
            .checked_mul(BASIS_POINTS).unwrap_or(1)
            .checked_mul(EPOCHS_PER_YEAR).unwrap_or(1);

        let pending = numerator.checked_div(denominator).unwrap_or(0);

        msg!("Pending $FSOC rewards: {}", pending);
        Ok(pending)
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

    /// $sFSOC token mint (share token that users stake)
    pub lp_token_mint: Account<'info, Mint>,
    /// $FSOC token mint (reward token users earn)
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
pub struct EmergencyWithdraw<'info> {
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

#[derive(Accounts)]
pub struct WithdrawRewards<'info> {
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

#[derive(Accounts)]
pub struct GetPendingRewards<'info> {
    #[account(
        seeds = [b"pool", pool.lp_token_mint.as_ref()],
        bump = pool.bump
    )]
    pub pool: Account<'info, StakingPool>,

    #[account(
        seeds = [b"stake", pool.key().as_ref(), user.key().as_ref()],
        bump = stake_account.bump
    )]
    pub stake_account: Account<'info, StakeAccount>,

    /// CHECK: Just reading, no signature required
    pub user: AccountInfo<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct StakingPool {
    pub authority: Pubkey,
    pub lp_token_mint: Pubkey,      // $sFSOC (share token users stake)
    pub reward_token_mint: Pubkey,  // $FSOC (reward token users earn)
    pub pool_vault: Pubkey,
    pub reward_vault: Pubkey,
    #[max_len(32)]
    pub pool_name: String,
    pub base_apr: u64,
    pub total_staked: u64,
    pub total_stakers: u64,
    pub last_epoch: i64,
    pub paused: bool,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct StakeAccount {
    pub owner: Pubkey,
    pub pool: Pubkey,
    pub amount: u64,                // Amount of $sFSOC staked
    pub lock_days: u8,
    pub stake_time: i64,
    pub unlock_time: i64,
    pub multiplier: u64,
    pub last_claim_epoch: i64,
    pub accumulated_rewards: u64,   // Total $FSOC claimed
    pub bump: u8,
}

#[error_code]
pub enum StakingError {
    #[msg("Invalid stake amount")]
    InvalidAmount,
    #[msg("Stake amount too small (minimum 1 $sFSOC)")]
    StakeTooSmall,
    #[msg("Invalid lock period. Must be 1, 3, or 5 days")]
    InvalidLockPeriod,
    #[msg("No stake found")]
    NoStake,
    #[msg("Tokens are still locked")]
    StillLocked,
    #[msg("No rewards available yet")]
    NoRewardsYet,
    #[msg("Pool is paused")]
    PoolPaused,
    #[msg("Must claim rewards before staking additional tokens")]
    MustClaimBeforeAdditionalStake,
    #[msg("Insufficient $FSOC balance in reward vault")]
    InsufficientRewardBalance,
    #[msg("Math overflow")]
    MathOverflow,
}
