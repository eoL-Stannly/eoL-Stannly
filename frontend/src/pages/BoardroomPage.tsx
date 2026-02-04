import { useState, useEffect, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { getBondingService, BondingService } from '../services/stakingService';

interface BondOption {
  days: number;
  discount: number;
  label: string;
}

const BOND_OPTIONS: BondOption[] = [
  { days: 1, discount: 10, label: '1 Day Lock' },
  { days: 3, discount: 35, label: '3 Day Lock' },
  { days: 5, discount: 60, label: '5 Day Lock' },
];

type PaymentToken = 'SOL' | 'USDC';

// Price data (will be fetched from oracle in production)
const SHARK_PRICE = 0.00085; // in USD
const SOL_PRICE = 180; // in USD

export function BoardroomPage() {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const [selectedPayment, setSelectedPayment] = useState<PaymentToken>('SOL');
  const [amounts, setAmounts] = useState<Record<number, string>>({ 1: '', 3: '', 5: '' });
  const [discounts, setDiscounts] = useState<Record<number, number>>({
    1: 10,
    3: 35,
    5: 60,
  });
  const [solBalance, setSolBalance] = useState<number>(0);
  const [usdcBalance, setUsdcBalance] = useState<number>(0);
  const [sharkBalance, setSharkBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [bondingService, setBondingService] = useState<BondingService | null>(null);

  // Initialize bonding service
  useEffect(() => {
    if (connection) {
      setBondingService(getBondingService(connection));
    }
  }, [connection]);

  // Fetch wallet balances
  const fetchBalances = useCallback(async () => {
    if (!bondingService || !publicKey) return;

    try {
      const sol = await bondingService.getSolBalance(publicKey);
      const usdc = await bondingService.getUsdcBalance(publicKey);
      setSolBalance(sol);
      setUsdcBalance(usdc);
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  }, [bondingService, publicKey]);

  useEffect(() => {
    if (connected && publicKey) {
      fetchBalances();
    } else {
      setSolBalance(0);
      setUsdcBalance(0);
      setSharkBalance(0);
    }
  }, [connected, publicKey, fetchBalances]);

  // Simulate dynamic discount fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setDiscounts((prev) => {
        const newDiscounts = { ...prev };
        Object.keys(newDiscounts).forEach((key) => {
          const k = Number(key);
          const baseDiscount = k === 1 ? 10 : k === 3 ? 35 : 60;
          const variance = baseDiscount * 0.1; // 10% variance
          const change = (Math.random() - 0.5) * variance;
          newDiscounts[k] = Math.max(
            baseDiscount - variance,
            Math.min(baseDiscount + variance, prev[k] + change)
          );
        });
        return newDiscounts;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const calculateSharkAmount = (paymentAmount: string, discount: number) => {
    const amount = parseFloat(paymentAmount) || 0;
    if (amount === 0) return '0.00';

    const paymentValueUSD = selectedPayment === 'SOL' ? amount * SOL_PRICE : amount;
    const discountMultiplier = 1 + discount / 100;
    const sharkAmount = (paymentValueUSD / SHARK_PRICE) * discountMultiplier;

    return sharkAmount.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  const getBalance = () => {
    return selectedPayment === 'SOL' ? solBalance : usdcBalance;
  };

  const handleBond = async (days: number) => {
    if (!connected || !publicKey || !bondingService) {
      alert('Please connect your wallet first');
      return;
    }

    const amount = amounts[days];
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter an amount');
      return;
    }

    const numAmount = parseFloat(amount);
    const balance = getBalance();
    if (numAmount > balance) {
      alert(`Insufficient ${selectedPayment} balance`);
      return;
    }

    setIsLoading(true);
    try {
      const sharkAmount = calculateSharkAmount(amount, discounts[days]);
      console.log(`Bonding ${amount} ${selectedPayment} for ${sharkAmount} SHARK (${days} day lock)`);

      alert(
        `Bonding feature will be available after smart contract deployment to devnet.\n\n` +
        `Transaction details:\n` +
        `- Payment: ${amount} ${selectedPayment}\n` +
        `- Discount: ${discounts[days].toFixed(1)}%\n` +
        `- You will receive: ${sharkAmount} SHARK\n` +
        `- Lock Period: ${days} day(s)\n` +
        `- Vesting ends: ${new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString()}`
      );
    } catch (error) {
      console.error('Bonding error:', error);
      alert('Failed to create bond. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="boardroom-page page-with-background">
      <div className="app-content">
        <h1 className="boardroom-title">&gt; BOARDROOM</h1>
        <p className="boardroom-subtitle">
          Bond tokens at a discount from the F-Society Treasury
        </p>

        <div className="disclaimer">
          <span className="disclaimer-icon">⚠</span>
          <strong>DISCLAIMER:</strong> Bond discounts are dynamic and can change rapidly based on
          market conditions and treasury requirements. The displayed rates are indicative and may
          differ at the time of transaction execution.
        </div>

        {/* Balance Display */}
        {connected && (
          <div className="detail-card" style={{ maxWidth: '600px', margin: '0 auto 1.5rem' }}>
            <h3 className="detail-card-title">Your Balances</h3>
            <div className="epoch-info">
              <div className="epoch-item">
                <span className="epoch-label">SOL</span>
                <span className="epoch-value">{solBalance.toFixed(4)}</span>
              </div>
              <div className="epoch-item">
                <span className="epoch-label">USDC</span>
                <span className="epoch-value">{usdcBalance.toFixed(2)}</span>
              </div>
              <div className="epoch-item">
                <span className="epoch-label">SHARK</span>
                <span className="epoch-value">{sharkBalance.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="bond-grid">
          {BOND_OPTIONS.map((option) => (
            <div key={option.days} className="bond-card">
              <div className="bond-header">
                <span className="bond-duration">{option.label}</span>
                <span className="bond-discount">
                  {discounts[option.days].toFixed(1)}% OFF
                </span>
              </div>

              <div className="bond-info">
                <div className="bond-row">
                  <span className="bond-label">Lock Period</span>
                  <span className="bond-value">{option.days} Day{option.days > 1 ? 's' : ''}</span>
                </div>
                <div className="bond-row">
                  <span className="bond-label">Current Discount</span>
                  <span className="bond-value" style={{ color: 'var(--green-primary)' }}>
                    {discounts[option.days].toFixed(1)}%
                  </span>
                </div>
                <div className="bond-row">
                  <span className="bond-label">$SHARK Price</span>
                  <span className="bond-value">${SHARK_PRICE.toFixed(5)}</span>
                </div>
                <div className="bond-row">
                  <span className="bond-label">Discounted Price</span>
                  <span className="bond-value">
                    ${(SHARK_PRICE * (1 - discounts[option.days] / 100)).toFixed(5)}
                  </span>
                </div>
              </div>

              <div className="payment-selector">
                <button
                  className={`payment-btn ${selectedPayment === 'SOL' ? 'active' : ''}`}
                  onClick={() => setSelectedPayment('SOL')}
                >
                  SOL
                </button>
                <button
                  className={`payment-btn ${selectedPayment === 'USDC' ? 'active' : ''}`}
                  onClick={() => setSelectedPayment('USDC')}
                >
                  USDC
                </button>
              </div>

              <div className="input-group">
                <label className="input-label">Amount ({selectedPayment})</label>
                <input
                  type="number"
                  className="token-input"
                  placeholder="0.00"
                  value={amounts[option.days]}
                  onChange={(e) =>
                    setAmounts((prev) => ({ ...prev, [option.days]: e.target.value }))
                  }
                />
                <div className="balance-info">
                  You will receive: {calculateSharkAmount(amounts[option.days], discounts[option.days])} $SHARK
                </div>
                {connected && (
                  <div className="balance-info" style={{ marginTop: '0.25rem' }}>
                    Balance: {getBalance().toFixed(4)} {selectedPayment}
                  </div>
                )}
              </div>

              <button
                className="bond-btn"
                onClick={() => handleBond(option.days)}
                disabled={!connected || !amounts[option.days] || isLoading}
              >
                {isLoading ? 'Processing...' : connected ? 'Bond' : 'Connect Wallet'}
              </button>
            </div>
          ))}
        </div>

        {/* Vesting Info */}
        {connected && (
          <div className="detail-card" style={{ maxWidth: '600px', margin: '2rem auto 0' }}>
            <h3 className="detail-card-title">Your Active Bonds</h3>
            <div className="epoch-info">
              <div className="epoch-item">
                <span className="epoch-label">Total Bonded</span>
                <span className="epoch-value">0.00 $SHARK</span>
              </div>
              <div className="epoch-item">
                <span className="epoch-label">Claimable</span>
                <span className="epoch-value">0.00 $SHARK</span>
              </div>
              <div className="epoch-item">
                <span className="epoch-label">Vesting</span>
                <span className="epoch-value">0.00 $SHARK</span>
              </div>
            </div>
            <button className="stake-btn" style={{ marginTop: '1rem' }} disabled>
              Claim Vested Tokens
            </button>
          </div>
        )}

        {/* Contract Info */}
        <div className="detail-card" style={{ maxWidth: '600px', margin: '1.5rem auto 0' }}>
          <h3 className="detail-card-title">Contract Information</h3>
          <div className="epoch-info">
            <div className="epoch-item">
              <span className="epoch-label">Bonding Program</span>
              <span className="epoch-value" style={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>
                FBond111...1111
              </span>
            </div>
            <div className="epoch-item">
              <span className="epoch-label">Treasury Wallet</span>
              <span className="epoch-value" style={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>
                Placeholder
              </span>
            </div>
            <div className="epoch-item">
              <span className="epoch-label">SHARK Token</span>
              <span className="epoch-value" style={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>
                63Z3...pump
              </span>
            </div>
            <div className="epoch-item">
              <span className="epoch-label">USDC (Native)</span>
              <span className="epoch-value" style={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>
                EPjF...Dt1v
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
