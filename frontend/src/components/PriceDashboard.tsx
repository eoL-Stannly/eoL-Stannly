import { useEffect, useState, useCallback } from 'react';
import { PriceChart } from './PriceChart';
import { TradingViewChart } from './TradingViewChart';
import {
  PriceData,
  CryptoSymbol,
  PRICE_FEEDS,
  fetchAllPrices,
  subscribeToPrices,
} from '../services/pythService';

type ChartView = 'default' | 'tradingview';

type TimeRange = '1m' | '5m' | '15m' | '1h' | '4h' | '12h' | '1d' | '1w' | '1mo';

const TIME_RANGES: { label: string; value: TimeRange }[] = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '1H', value: '1h' },
  { label: '4H', value: '4h' },
  { label: '12H', value: '12h' },
  { label: '1D', value: '1d' },
  { label: '1W', value: '1w' },
  { label: '1M', value: '1mo' },
];

export function PriceDashboard() {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoSymbol>('SOL');
  const [timeRange, setTimeRange] = useState<TimeRange>('1d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [chartView, setChartView] = useState<ChartView>('default');

  const loadPrices = useCallback(async () => {
    try {
      setError(null);
      setRetrying(true);
      const allPrices = await fetchAllPrices();
      setPrices(allPrices);
      setLastUpdate(new Date());
    } catch (err) {
      setError('CONNECTION_FAILED: Unable to fetch price data from Pyth Network');
      console.error(err);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  }, []);

  useEffect(() => {
    loadPrices();

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
        <div className="terminal-loader">
          <span className="terminal-line">&gt; Connecting to Pyth Network...</span>
          <span className="terminal-line">&gt; Fetching price feeds<span className="blink">_</span></span>
        </div>
      </div>
    );
  }

  if (error && prices.length === 0) {
    return (
      <div className="dashboard-error">
        <div className="error-terminal">
          <span className="error-line">&gt; ERROR: {error}</span>
          <span className="error-line">&gt; Status: DISCONNECTED</span>
          <button className="retry-btn" onClick={loadPrices} disabled={retrying}>
            {retrying ? '> Retrying...' : '> Retry connection'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="price-dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h2>&gt; PRICE_FEED</h2>
          <span className="status-indicator">
            <span className="status-dot"></span>
            LIVE
          </span>
        </div>
        <div className="header-right">
          <span className="powered-by">
            src:{' '}
            <a href="https://pyth.network" target="_blank" rel="noopener noreferrer">
              pyth.network
            </a>
          </span>
          {lastUpdate && (
            <span className="last-update">
              {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Crypto Selector */}
      <div className="crypto-selector">
        {prices.map((price) => (
          <button
            key={price.symbol}
            className={`crypto-pill ${selectedCrypto === price.symbol ? 'active' : ''}`}
            onClick={() => setSelectedCrypto(price.symbol)}
          >
            <span className="pill-symbol">{price.symbol}</span>
            <span className="pill-price">{formatPrice(price.price)}</span>
          </button>
        ))}
      </div>

      {/* Chart View Toggle */}
      <div className="chart-toggle">
        <button
          className={`toggle-btn ${chartView === 'default' ? 'active' : ''}`}
          onClick={() => setChartView('default')}
        >
          Area Chart
        </button>
        <button
          className={`toggle-btn ${chartView === 'tradingview' ? 'active' : ''}`}
          onClick={() => setChartView('tradingview')}
        >
          TradingView
        </button>
      </div>

      {/* Main Chart */}
      {selectedPrice && (
        <div className="main-chart-section">
          {chartView === 'default' ? (
            <PriceChart priceData={selectedPrice} timeRange={timeRange} />
          ) : (
            <TradingViewChart priceData={selectedPrice} timeRange={timeRange} />
          )}

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
              <span className="card-symbol">[{price.symbol}]</span>
              <span className="card-name">{price.name}</span>
            </div>
            <div className="card-price">{formatPrice(price.price)}</div>
            <div className="card-confidence">
              conf: ±{formatPrice(price.confidence)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
