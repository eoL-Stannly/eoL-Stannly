import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { getStakingService, StakingService } from '../services/stakingService';

interface LockOption {
  days: number;
  multiplier: string;
  label: string;
}

const LOCK_OPTIONS: LockOption[] = [
  { days: 1, multiplier: '1.0x', label: '1 Day' },
  { days: 3, multiplier: '1.5x', label: '3 Days' },
  { days: 5, multiplier: '2.0x', label: '5 Days' },
];

// Pool configurations
const POOLS: Record<string, { name: string; token: string; description: string; rewardToken: string }> = {
  penguin: {
    name: 'PENGUIN Pool',
    token: 'SHARK-LP',
    rewardToken: 'PENGUIN',
    description: 'Stake SHARK LP tokens to earn PENGUIN rewards',
  },
  k2: {
    name: 'K2 Pool',
    token: 'SHARK-LP',
    rewardToken: 'K2',
    description: 'Stake SHARK LP tokens to earn K2 rewards',
  },
  shark: {
    name: 'SHARK Pool',
    token: 'SHARK-LP',
    rewardToken: 'SHARK',
    description: 'Stake SHARK LP tokens to earn more SHARK rewards',
  },
};

// Calculate time until next epoch (4 hour epochs)
function getNextEpochTime(): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const epochDuration = 4 * 60 * 60 * 1000; // 4 hours in ms
  const currentEpochStart = Math.floor(now.getTime() / epochDuration) * epochDuration;
  const nextEpochTime = currentEpochStart + epochDuration;
  const remaining = nextEpochTime - now.getTime();

  const hours = Math.floor(remaining / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((remaining % (60 * 1000)) / 1000);

  return { hours, minutes, seconds };
}

export function PoolDetailPage() {
  const { poolId } = useParams<{ poolId: string }>();
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const [selectedLock, setSelectedLock] = useState<number>(1);
  const [stakeAmount, setStakeAmount] = useState('');
  const [epochCountdown, setEpochCountdown] = useState(getNextEpochTime());
  const [currentApr, setCurrentApr] = useState(Math.random() * 9500 + 500);
  const [lpBalance, setLpBalance] = useState<number>(0);
  const [stakedAmount, setStakedAmount] = useState<number>(0);
  const [pendingRewards, setPendingRewards] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [stakingService, setStakingService] = useState<StakingService | null>(null);

  const pool = poolId ? POOLS[poolId] : null;

  // Initialize staking service
  useEffect(() => {
    if (connection) {
      setStakingService(getStakingService(connection));
    }
  }, [connection]);

  // Fetch wallet balances
  const fetchBalances = useCallback(async () => {
    if (!stakingService || !publicKey) return;

    try {
      const balance = await stakingService.getLPBalance(publicKey);
      setLpBalance(balance);

      const stakeInfo = await stakingService.getStakeInfo(publicKey, poolId || '');
      if (stakeInfo) {
        setStakedAmount(stakeInfo.amount);
        setPendingRewards(stakeInfo.pendingRewards);
      }
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  }, [stakingService, publicKey, poolId]);

  useEffect(() => {
    if (connected && publicKey) {
      fetchBalances();
    } else {
      setLpBalance(0);
      setStakedAmount(0);
      setPendingRewards(0);
    }
  }, [connected, publicKey, fetchBalances]);

  // Update epoch countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setEpochCountdown(getNextEpochTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Simulate APR fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentApr((prev) => {
        const change = (Math.random() - 0.5) * 200;
        let newApr = prev + change;
        newApr = Math.max(500, Math.min(10000, newApr));
        return newApr;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!pool) {
    return (
      <div className="pool-detail-page page-with-background">
        <div className="app-content">
          <div className="error-terminal">
            <span className="error-line">&gt; ERROR: Pool not found</span>
            <Link to="/staking" className="back-btn">
              &lt; Back to Pools
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatCountdown = () => {
    const { hours, minutes, seconds } = epochCountdown;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMaxClick = () => {
    setStakeAmount(lpBalance.toString());
  };

  const handleStake = async () => {
    if (!connected || !publicKey || !stakingService) {
      alert('Please connect your wallet first');
      return;
    }

    const amount = parseFloat(stakeAmount);
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (amount > lpBalance) {
      alert('Insufficient LP token balance');
      return;
    }

    setIsLoading(true);
    try {
      // For now, just log - actual transaction will be implemented after deployment
      console.log(`Staking ${amount} LP tokens for ${selectedLock} days in ${poolId} pool`);
      alert(`Staking feature will be available after smart contract deployment to devnet.\n\nTransaction details:\n- Amount: ${amount} ${pool.token}\n- Lock Period: ${selectedLock} days\n- Multiplier: ${selectedLock === 1 ? '1.0x' : selectedLock === 3 ? '1.5x' : '2.0x'}`);
    } catch (error) {
      console.error('Staking error:', error);
      alert('Failed to stake. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!connected || !publicKey || !stakingService) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      console.log(`Claiming rewards from ${poolId} pool`);
      alert('Claim feature will be available after smart contract deployment to devnet.');
    } catch (error) {
      console.error('Claim error:', error);
      alert('Failed to claim. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getMultiplier = (days: number) => {
    return days === 1 ? 1 : days === 3 ? 1.5 : 2;
  };

  return (
    <div className="pool-detail-page page-with-background">
      <div className="app-content">
        <div className="pool-detail-header">
          <h1 className="pool-detail-title">&gt; {pool.name}</h1>
          <Link to="/staking" className="back-btn">
            &lt; Back to Pools
          </Link>
        </div>

        <p className="staking-subtitle">{pool.description}</p>

        <div className="pool-detail-content">
          {/* Lock Period Selection */}
          <div className="detail-card">
            <h3 className="detail-card-title">Lock Period</h3>
            <div className="lock-options">
              {LOCK_OPTIONS.map((option) => (
                <div
                  key={option.days}
                  className={`lock-option ${selectedLock === option.days ? 'selected' : ''}`}
                  onClick={() => setSelectedLock(option.days)}
                >
                  <span className="lock-duration">{option.label}</span>
                  <span className="lock-multiplier">{option.multiplier} Rewards</span>
                </div>
              ))}
            </div>

            <div className="staking-form">
              <div className="input-group">
                <label className="input-label">
                  Amount to Stake ({pool.token})
                  <button className="max-btn" onClick={handleMaxClick} disabled={!connected}>
                    MAX
                  </button>
                </label>
                <input
                  type="number"
                  className="token-input"
                  placeholder="0.00"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                />
                <div className="balance-info">
                  Balance: {connected ? lpBalance.toFixed(4) : 'Connect wallet'} {pool.token}
                </div>
              </div>

              <button
                className="stake-btn"
                onClick={handleStake}
                disabled={!connected || !stakeAmount || isLoading}
              >
                {isLoading ? 'Processing...' : connected ? 'Stake LP Tokens' : 'Connect Wallet'}
              </button>
            </div>
          </div>

          {/* Rebase Info */}
          <div className="detail-card">
            <h3 className="detail-card-title">Rebase Information</h3>
            <div className="epoch-info">
              <div className="epoch-item">
                <span className="epoch-label">Epoch Duration</span>
                <span className="epoch-value">4 Hours</span>
              </div>
              <div className="epoch-item">
                <span className="epoch-label">Current APR</span>
                <span className="epoch-value" style={{ color: 'var(--green-primary)' }}>
                  {currentApr.toLocaleString('en-US', { maximumFractionDigits: 0 })}%
                </span>
              </div>
              <div className="epoch-item">
                <span className="epoch-label">Rebase Rate (per epoch)</span>
                <span className="epoch-value">
                  ~{((currentApr / 365 / 6) * getMultiplier(selectedLock)).toFixed(3)}%
                </span>
              </div>
              <div className="epoch-item">
                <span className="epoch-label">Your Staked</span>
                <span className="epoch-value">{stakedAmount.toFixed(4)} {pool.token}</span>
              </div>
              <div className="epoch-item">
                <span className="epoch-label">Pending Rewards</span>
                <span className="epoch-value">{pendingRewards.toFixed(4)} {pool.rewardToken}</span>
              </div>
            </div>

            <div className="epoch-countdown">
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                NEXT REBASE IN
              </div>
              {formatCountdown()}
            </div>

            <button
              className="stake-btn"
              style={{ marginTop: '1rem' }}
              disabled={!connected || pendingRewards <= 0 || isLoading}
              onClick={handleClaim}
            >
              {isLoading ? 'Processing...' : 'Claim Rewards'}
            </button>
          </div>
        </div>

        {/* Contract Info */}
        <div className="detail-card" style={{ marginTop: '1.5rem', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
          <h3 className="detail-card-title">Contract Information</h3>
          <div className="epoch-info">
            <div className="epoch-item">
              <span className="epoch-label">Staking Program</span>
              <span className="epoch-value" style={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>
                FSoc1111...1111
              </span>
            </div>
            <div className="epoch-item">
              <span className="epoch-label">LP Token</span>
              <span className="epoch-value" style={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>
                6jqj...GNuGK
              </span>
            </div>
            <div className="epoch-item">
              <span className="epoch-label">Network</span>
              <span className="epoch-value">Devnet</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
