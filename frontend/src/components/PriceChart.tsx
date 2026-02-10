import { useEffect, useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  PriceData,
  PriceHistoryPoint,
  generateMockHistory,
} from '../services/pythService';

interface PriceChartProps {
  priceData: PriceData;
  timeRange: '1m' | '5m' | '15m' | '1h' | '4h' | '12h' | '1d' | '1w' | '1mo';
}

// Time range configurations for chart data points
// Each config specifies how many data points to show and the interval between them
const TIME_RANGE_CONFIG: Record<string, { points: number; intervalMs: number }> = {
  '1m': { points: 60, intervalMs: 1000 },                    // 60 points, 1 sec each = 1 minute
  '5m': { points: 60, intervalMs: 5 * 1000 },                // 60 points, 5 sec each = 5 minutes
  '15m': { points: 60, intervalMs: 15 * 1000 },              // 60 points, 15 sec each = 15 minutes
  '1h': { points: 60, intervalMs: 60 * 1000 },               // 60 points, 1 min each = 1 hour
  '4h': { points: 48, intervalMs: 5 * 60 * 1000 },           // 48 points, 5 min each = 4 hours
  '12h': { points: 72, intervalMs: 10 * 60 * 1000 },         // 72 points, 10 min each = 12 hours
  '1d': { points: 48, intervalMs: 30 * 60 * 1000 },          // 48 points, 30 min each = 1 day
  '1w': { points: 84, intervalMs: 2 * 60 * 60 * 1000 },      // 84 points, 2 hours each = 1 week
  '1mo': { points: 60, intervalMs: 12 * 60 * 60 * 1000 },    // 60 points, 12 hours each = 1 month
};

export function PriceChart({ priceData, timeRange }: PriceChartProps) {
  const [history, setHistory] = useState<PriceHistoryPoint[]>([]);

  useEffect(() => {
    const config = TIME_RANGE_CONFIG[timeRange];
    // More volatility for longer time ranges (larger price swings over time)
    const volatility = ['1m', '5m', '15m'].includes(timeRange) ? 0.005 :
                       ['1h', '4h', '12h'].includes(timeRange) ? 0.01 :
                       ['1d', '1w'].includes(timeRange) ? 0.02 : 0.05;
    setHistory(generateMockHistory(priceData.price, config.points, volatility));
  }, [priceData.price, timeRange]);

  const formatPrice = (value: number) => {
    if (value >= 1000) {
      return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    } else if (value >= 1) {
      return `$${value.toFixed(2)}`;
    } else {
      return `$${value.toFixed(4)}`;
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    if (['1m', '5m', '15m'].includes(timeRange)) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } else if (['1h', '4h', '12h'].includes(timeRange)) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeRange === '1d') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeRange === '1w') {
      return date.toLocaleDateString([], { weekday: 'short', day: 'numeric' });
    } else {
      // '1mo' timeframe
      return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
    }
  };

  const priceChange = useMemo(() => {
    if (history.length < 2) return 0;
    const firstPrice = history[0].price;
    const lastPrice = history[history.length - 1].price;
    return ((lastPrice - firstPrice) / firstPrice) * 100;
  }, [history]);

  const isPositive = priceChange >= 0;
  const gradientId = `gradient-${priceData.symbol}`;

  return (
    <div className="price-chart-container">
      <div className="price-chart-header">
        <div className="price-info">
          <div className="crypto-icon">
            <span className="terminal-bracket">[</span>
            {priceData.symbol}
            <span className="terminal-bracket">]</span>
          </div>
          <div className="crypto-details">
            <h3>{priceData.name}</h3>
            <span className="symbol">{priceData.symbol}/USD</span>
          </div>
        </div>
        <div className="price-value">
          <span className="current-price">{formatPrice(priceData.price)}</span>
          <span className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '+' : ''}
            {priceChange.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={history}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={isPositive ? '#00ff00' : '#ff3333'}
                  stopOpacity={0.4}
                />
                <stop
                  offset="50%"
                  stopColor={isPositive ? '#00ff00' : '#ff3333'}
                  stopOpacity={0.1}
                />
                <stop
                  offset="100%"
                  stopColor={isPositive ? '#00ff00' : '#ff3333'}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatTime}
              stroke="#1a1a1a"
              tick={{ fill: '#00ff00', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#1a1a1a' }}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(v) => formatPrice(v)}
              stroke="#1a1a1a"
              tick={{ fill: '#00ff00', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
              width={75}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as PriceHistoryPoint;
                  return (
                    <div className="chart-tooltip">
                      <p className="tooltip-price">{formatPrice(data.price)}</p>
                      <p className="tooltip-time">
                        {new Date(data.timestamp).toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositive ? '#00ff00' : '#ff3333'}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
