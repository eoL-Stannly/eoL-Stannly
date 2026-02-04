import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { WalletContextState } from '@solana/wallet-adapter-react';

// Program IDs (to be updated after deployment)
export const STAKING_PROGRAM_ID = new PublicKey('FSoc1111111111111111111111111111111111111111');
export const BONDING_PROGRAM_ID = new PublicKey('FBond111111111111111111111111111111111111111');

// Token Mints
export const SHARK_MINT = new PublicKey('63Z3Q7JX3SBGDiiwqqnPTVvHcuUk6ixkzsYQbKzhpump');
export const SHARK_LP_MINT = new PublicKey('6jqjEFzcisQokMJNiEG3YWFocdmZtUZtd6gxLr9GNuGK');
export const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

// Lock periods
export const LOCK_PERIODS = {
  DAY_1: { days: 1, multiplier: 1.0, label: '1 Day' },
  DAY_3: { days: 3, multiplier: 1.5, label: '3 Days' },
  DAY_5: { days: 5, multiplier: 2.0, label: '5 Days' },
};

// Bond discounts
export const BOND_DISCOUNTS = {
  DAY_1: { days: 1, discount: 10, label: '1 Day Lock' },
  DAY_3: { days: 3, discount: 35, label: '3 Day Lock' },
  DAY_5: { days: 5, discount: 60, label: '5 Day Lock' },
};

export interface StakeInfo {
  owner: PublicKey;
  pool: PublicKey;
  amount: number;
  lockDays: number;
  stakeTime: number;
  unlockTime: number;
  multiplier: number;
  pendingRewards: number;
}

export interface BondInfo {
  owner: PublicKey;
  treasury: PublicKey;
  paymentAmount: number;
  paymentType: 'SOL' | 'USDC';
  sharkAmount: number;
  discount: number;
  lockDays: number;
  bondTime: number;
  unlockTime: number;
  claimed: boolean;
}

export interface PoolInfo {
  authority: PublicKey;
  lpTokenMint: PublicKey;
  rewardTokenMint: PublicKey;
  poolVault: PublicKey;
  rewardVault: PublicKey;
  poolName: string;
  baseApr: number;
  totalStaked: number;
  totalStakers: number;
}

// Helper function to get PDA for pool
export function getPoolPDA(lpTokenMint: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('pool'), lpTokenMint.toBuffer()],
    STAKING_PROGRAM_ID
  );
}

// Helper function to get PDA for stake account
export function getStakeAccountPDA(pool: PublicKey, user: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('stake'), pool.toBuffer(), user.toBuffer()],
    STAKING_PROGRAM_ID
  );
}

// Helper function to get PDA for treasury
export function getTreasuryPDA(sharkMint: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('treasury'), sharkMint.toBuffer()],
    BONDING_PROGRAM_ID
  );
}

// Helper function to get PDA for bond
export function getBondPDA(treasury: PublicKey, user: PublicKey, bondIndex: number): [PublicKey, number] {
  const bondIndexBuffer = Buffer.alloc(8);
  bondIndexBuffer.writeBigUInt64LE(BigInt(bondIndex));
  return PublicKey.findProgramAddressSync(
    [Buffer.from('bond'), treasury.toBuffer(), user.toBuffer(), bondIndexBuffer],
    BONDING_PROGRAM_ID
  );
}

// Staking Service Class
export class StakingService {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  // Get user's LP token balance
  async getLPBalance(wallet: PublicKey): Promise<number> {
    try {
      const ata = await getAssociatedTokenAddress(SHARK_LP_MINT, wallet);
      const balance = await this.connection.getTokenAccountBalance(ata);
      return Number(balance.value.amount) / Math.pow(10, balance.value.decimals);
    } catch {
      return 0;
    }
  }

  // Get user's SHARK token balance
  async getSharkBalance(wallet: PublicKey): Promise<number> {
    try {
      const ata = await getAssociatedTokenAddress(SHARK_MINT, wallet);
      const balance = await this.connection.getTokenAccountBalance(ata);
      return Number(balance.value.amount) / Math.pow(10, balance.value.decimals);
    } catch {
      return 0;
    }
  }

  // Get pool info (mock for now until program is deployed)
  async getPoolInfo(poolId: string): Promise<PoolInfo | null> {
    // This will be replaced with actual on-chain data after deployment
    const mockPools: Record<string, PoolInfo> = {
      penguin: {
        authority: PublicKey.default,
        lpTokenMint: SHARK_LP_MINT,
        rewardTokenMint: new PublicKey('8Jx8AAHj86wbQgUTjGuj6GTTL5Ps3cqxKRTvpaJApump'), // PENGUIN
        poolVault: PublicKey.default,
        rewardVault: PublicKey.default,
        poolName: 'PENGUIN Pool',
        baseApr: 5000, // 50%
        totalStaked: 1200000,
        totalStakers: 2847,
      },
      k2: {
        authority: PublicKey.default,
        lpTokenMint: SHARK_LP_MINT,
        rewardTokenMint: new PublicKey('8aZEym6Uv5vuy2LQ9BYNSiSiiKS3JKJEhbiUgpQppump'), // K2
        poolVault: PublicKey.default,
        rewardVault: PublicKey.default,
        poolName: 'K2 Pool',
        baseApr: 4500, // 45%
        totalStaked: 890000,
        totalStakers: 1523,
      },
      shark: {
        authority: PublicKey.default,
        lpTokenMint: SHARK_LP_MINT,
        rewardTokenMint: SHARK_MINT,
        poolVault: PublicKey.default,
        rewardVault: PublicKey.default,
        poolName: 'SHARK Pool',
        baseApr: 6000, // 60%
        totalStaked: 2100000,
        totalStakers: 4215,
      },
    };

    return mockPools[poolId] || null;
  }

  // Get user's stake info (mock for now)
  async getStakeInfo(_wallet: PublicKey, _poolId: string): Promise<StakeInfo | null> {
    // This will be replaced with actual on-chain data after deployment
    // For now, return null (no stake)
    return null;
  }

  // Calculate rewards (mock for now)
  calculatePendingRewards(
    stakedAmount: number,
    baseApr: number,
    multiplier: number,
    lastClaimEpoch: number
  ): number {
    const EPOCH_DURATION = 4 * 60 * 60 * 1000; // 4 hours in ms
    const EPOCHS_PER_YEAR = 2190;
    const currentEpoch = Math.floor(Date.now() / EPOCH_DURATION);
    const epochsPassed = currentEpoch - lastClaimEpoch;

    if (epochsPassed <= 0) return 0;

    const rewardPerEpoch = (stakedAmount * (baseApr / 10000) * multiplier) / EPOCHS_PER_YEAR;
    return rewardPerEpoch * epochsPassed;
  }

  // Prepare stake transaction (to be implemented with Anchor)
  async prepareStakeTransaction(
    _wallet: WalletContextState,
    _poolId: string,
    amount: number,
    lockDays: number
  ): Promise<Transaction | null> {
    // Placeholder: This will be implemented with Anchor IDL after deployment
    console.log(`Preparing stake: ${amount} LP tokens, ${lockDays} day lock`);

    // For now, return null - actual implementation requires deployed program
    return null;
  }

  // Prepare unstake transaction
  async prepareUnstakeTransaction(
    _wallet: WalletContextState,
    _poolId: string
  ): Promise<Transaction | null> {
    // Placeholder: This will be implemented with Anchor IDL after deployment
    console.log('Preparing unstake');

    return null;
  }

  // Prepare claim rewards transaction
  async prepareClaimTransaction(
    _wallet: WalletContextState,
    _poolId: string
  ): Promise<Transaction | null> {
    // Placeholder: This will be implemented with Anchor IDL after deployment
    console.log('Preparing claim');

    return null;
  }
}

// Bonding Service Class
export class BondingService {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  // Get SOL balance
  async getSolBalance(wallet: PublicKey): Promise<number> {
    try {
      const balance = await this.connection.getBalance(wallet);
      return balance / 1e9; // Convert lamports to SOL
    } catch {
      return 0;
    }
  }

  // Get USDC balance
  async getUsdcBalance(wallet: PublicKey): Promise<number> {
    try {
      const ata = await getAssociatedTokenAddress(USDC_MINT, wallet);
      const balance = await this.connection.getTokenAccountBalance(ata);
      return Number(balance.value.amount) / Math.pow(10, balance.value.decimals);
    } catch {
      return 0;
    }
  }

  // Get user's bonds (mock for now)
  async getUserBonds(_wallet: PublicKey): Promise<BondInfo[]> {
    // This will be replaced with actual on-chain data after deployment
    return [];
  }

  // Calculate SHARK amount for bond
  calculateSharkAmount(
    paymentAmount: number,
    paymentType: 'SOL' | 'USDC',
    lockDays: number,
    sharkPriceUsd: number = 0.00085,
    solPriceUsd: number = 180
  ): number {
    const discount = BOND_DISCOUNTS[`DAY_${lockDays}` as keyof typeof BOND_DISCOUNTS]?.discount || 0;
    const discountMultiplier = 1 + discount / 100;

    let paymentValueUsd: number;
    if (paymentType === 'SOL') {
      paymentValueUsd = paymentAmount * solPriceUsd;
    } else {
      paymentValueUsd = paymentAmount;
    }

    return (paymentValueUsd / sharkPriceUsd) * discountMultiplier;
  }

  // Prepare bond with SOL transaction
  async prepareBondSolTransaction(
    _wallet: WalletContextState,
    solAmount: number,
    lockDays: number
  ): Promise<Transaction | null> {
    // Placeholder: This will be implemented with Anchor IDL after deployment
    console.log(`Preparing SOL bond: ${solAmount} SOL, ${lockDays} day lock`);

    return null;
  }

  // Prepare bond with USDC transaction
  async prepareBondUsdcTransaction(
    _wallet: WalletContextState,
    usdcAmount: number,
    lockDays: number
  ): Promise<Transaction | null> {
    // Placeholder: This will be implemented with Anchor IDL after deployment
    console.log(`Preparing USDC bond: ${usdcAmount} USDC, ${lockDays} day lock`);

    return null;
  }

  // Prepare claim bond transaction
  async prepareClaimBondTransaction(
    _wallet: WalletContextState,
    bondIndex: number
  ): Promise<Transaction | null> {
    // Placeholder: This will be implemented with Anchor IDL after deployment
    console.log(`Preparing claim for bond index: ${bondIndex}`);

    return null;
  }
}

// Create singleton instances
let stakingService: StakingService | null = null;
let bondingService: BondingService | null = null;

export function getStakingService(connection: Connection): StakingService {
  if (!stakingService) {
    stakingService = new StakingService(connection);
  }
  return stakingService;
}

export function getBondingService(connection: Connection): BondingService {
  if (!bondingService) {
    bondingService = new BondingService(connection);
  }
  return bondingService;
}
