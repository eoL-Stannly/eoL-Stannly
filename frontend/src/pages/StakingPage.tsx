import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

interface PoolData {
  id: string;
  name: string;
  badge: string;
  apr: number;
  tvl: string;
  stakers: number;
}

// Smooth APR animation with variable speeds
function useAnimatedAPR(minApr: number, maxApr: number) {
  const [apr, setApr] = useState(Math.random() * (maxApr - minApr) + minApr);
  const targetRef = useRef(apr);
  const speedRef = useRef(Math.random() * 50 + 20);
  const directionRef = useRef(Math.random() > 0.5 ? 1 : -1);

  useEffect(() => {
    const updateTarget = () => {
      // Randomly change direction and speed
      if (Math.random() < 0.1) {
        directionRef.current *= -1;
      }
      speedRef.current = Math.random() * 80 + 20;

      // Calculate new target
      const change = directionRef.current * speedRef.current;
      let newTarget = targetRef.current + change;

      // Keep within bounds
      if (newTarget > maxApr) {
        newTarget = maxApr;
        directionRef.current = -1;
      } else if (newTarget < minApr) {
        newTarget = minApr;
        directionRef.current = 1;
      }

      targetRef.current = newTarget;
    };

    // Smooth animation towards target
    const animateInterval = setInterval(() => {
      setApr((current) => {
        const diff = targetRef.current - current;
        const step = diff * 0.05; // Smooth easing
        return current + step;
      });
    }, 50);

    // Update target periodically with random intervals
    const updateInterval = setInterval(updateTarget, Math.random() * 2000 + 500);

    return () => {
      clearInterval(animateInterval);
      clearInterval(updateInterval);
    };
  }, [minApr, maxApr]);

  return apr;
}

function StakingPool({ pool }: { pool: PoolData }) {
  const animatedApr = useAnimatedAPR(500, 10000);

  const formatAPR = (value: number) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="staking-pool">
      <div className="pool-header">
        <span className="pool-name">{pool.name}</span>
        <span className="pool-badge">{pool.badge}</span>
      </div>

      <div className="apr-display">
        <div className="apr-label">Daily APR</div>
        <div className="apr-value">
          {formatAPR(animatedApr)}
          <span className="apr-percent">%</span>
        </div>
      </div>

      <div className="pool-stats">
        <div className="stat-item">
          <div className="stat-label">TVL</div>
          <div className="stat-value">{pool.tvl}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Stakers</div>
          <div className="stat-value">{pool.stakers.toLocaleString()}</div>
        </div>
      </div>

      <div className="lock-bonuses">
        <div className="bonus-item">1D: <span className="bonus-value">+10%</span></div>
        <div className="bonus-item">3D: <span className="bonus-value">+35%</span></div>
        <div className="bonus-item">5D: <span className="bonus-value">+60%</span></div>
      </div>

      <Link to={`/pool/${pool.id}`} className="stake-btn">
        Enter Pool
      </Link>
    </div>
  );
}

export function StakingPage() {
  const pools: PoolData[] = [
    {
      id: 'penguin',
      name: 'PENGUIN Pool',
      badge: 'HOT',
      apr: 0, // Will be animated
      tvl: '$1.2M',
      stakers: 2847,
    },
    {
      id: 'k2',
      name: 'K2 Pool',
      badge: 'NEW',
      apr: 0, // Will be animated
      tvl: '$890K',
      stakers: 1523,
    },
    {
      id: 'shark',
      name: 'SHARK Pool',
      badge: 'FEATURED',
      apr: 0, // Will be animated
      tvl: '$2.1M',
      stakers: 4215,
    },
  ];

  return (
    <div className="staking-page">
      <div className="app-content">
        <h1 className="staking-title">&gt; STAKING_POOLS</h1>
        <p className="staking-subtitle">
          Stake your tokens and earn dynamic rewards. Lock longer for bigger bonuses.
        </p>

        <div className="disclaimer" style={{ maxWidth: '600px', margin: '0 auto 1.5rem', fontSize: '0.75rem', color: 'var(--text-dim)', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <strong style={{ color: 'var(--green-dim)' }}>Note:</strong> Lock period bonuses (1 day: +10%, 3 days: +35%, 5 days: +60%) are dynamic and can change rapidly based on protocol conditions.
        </div>

        <div className="staking-grid">
          {pools.map((pool, index) => (
            <StakingPool key={index} pool={pool} />
          ))}
        </div>
      </div>
    </div>
  );
}
