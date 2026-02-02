import { useEffect, useState, useCallback } from 'react';
import { PriceChart } from './PriceChart';
import {
  PriceData,
  CryptoSymbol,
  PRICE_FEEDS,
  fetchAllPrices,
  subscribeToPrices,
} from '../services/pythService';

type TimeRange = '24h' | '1m' | '6m' | '1y' | '2y' | 'all';

const TIME_RANGES: { label: string; value: TimeRange }[] = [
  { label: '24 Hours', value: '24h' },
  { label: '1 Month', value: '1m' },
  { label: '6 Months', value: '6m' },
  { label: '1 Year', value: '1y' },
  { label: '2 Years', value: '2y' },
  { label: 'All', value: 'all' },
];

export function PriceDashboard() {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoSymbol>('SOL');
  const [timeRange, setTimeRange] = useState<TimeRange>('1y');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const loadPrices = useCallback(async () => {
    try {
      setError(null);
      const allPrices = await fetchAllPrices();
      setPrices(allPrices);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Failed to fetch prices. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrices();

    // Set up real-time updates
    const symbols = Object.keys(PRICE_FEEDS) as CryptoSymbol[];
    const unsubscribe = subscribeToPrices(symbols, (updatedPrices) => {
      setPrices((current) => {
        const updated = [...current];
        for (const newPrice of updatedPrices) {
          const index = updated.findIndex((p) => p.symbol === newPrice.symbol);
          if (index >= 0) {
            updated[index] = newPrice;
          }
        }
        return updated;
      });
      setLastUpdate(new Date());
    });

    // Refresh prices every 30 seconds as fallback
    const interval = setInterval(loadPrices, 30000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [loadPrices]);

  const selectedPrice = prices.find((p) => p.symbol === selectedCrypto);

  const formatPrice = (value: number) => {
    if (value >= 1000) {
      return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    } else if (value >= 1) {
      return `$${value.toFixed(2)}`;
    } else {
      return `$${value.toFixed(4)}`;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading prices from Pyth Network...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
        <button onClick={loadPrices}>Retry</button>
      </div>
    );
  }

  return (
    <div className="price-dashboard">
      <div className="dashboard-header">
        <h2>Crypto Prices</h2>
        <p className="powered-by">
          Powered by{' '}
          <a href="https://pyth.network" target="_blank" rel="noopener noreferrer">
            Pyth Network
          </a>
        </p>
        {lastUpdate && (
          <span className="last-update">
            Last update: {lastUpdate.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Crypto Selector Pills */}
      <div className="crypto-selector">
        {prices.map((price) => (
          <button
            key={price.symbol}
            className={`crypto-pill ${selectedCrypto === price.symbol ? 'active' : ''}`}
            onClick={() => setSelectedCrypto(price.symbol)}
            style={{
              borderColor:
                selectedCrypto === price.symbol ? price.color : 'transparent',
            }}
          >
            <span
              className="pill-dot"
              style={{ backgroundColor: price.color }}
            ></span>
            <span className="pill-symbol">{price.symbol}</span>
            <span className="pill-price">{formatPrice(price.price)}</span>
          </button>
        ))}
      </div>

      {/* Main Chart */}
      {selectedPrice && (
        <div className="main-chart-section">
          <PriceChart priceData={selectedPrice} timeRange={timeRange} />

          {/* Time Range Selector */}
          <div className="time-range-selector">
            {TIME_RANGES.map((range) => (
              <button
                key={range.value}
                className={`time-btn ${timeRange === range.value ? 'active' : ''}`}
                onClick={() => setTimeRange(range.value)}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Grid */}
      <div className="price-grid">
        {prices.map((price) => (
          <div
            key={price.symbol}
            className={`price-card ${selectedCrypto === price.symbol ? 'selected' : ''}`}
            onClick={() => setSelectedCrypto(price.symbol)}
          >
            <div className="card-header">
              <div
                className="card-icon"
                style={{ backgroundColor: price.color }}
              >
                {price.symbol.slice(0, 1)}
              </div>
              <div className="card-name">
                <strong>{price.symbol}</strong>
                <span>{price.name}</span>
              </div>
            </div>
            <div className="card-price">{formatPrice(price.price)}</div>
            <div className="card-confidence">
              ±{formatPrice(price.confidence)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
