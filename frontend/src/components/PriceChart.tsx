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
  timeRange: '24h' | '1m' | '6m' | '1y' | '2y' | 'all';
}

const TIME_RANGE_POINTS: Record<string, number> = {
  '24h': 24,
  '1m': 30,
  '6m': 60,
  '1y': 52,
  '2y': 104,
  all: 200,
};

export function PriceChart({ priceData, timeRange }: PriceChartProps) {
  const [history, setHistory] = useState<PriceHistoryPoint[]>([]);

  useEffect(() => {
    // Generate mock history based on current price
    // In production, fetch from a historical data API
    const points = TIME_RANGE_POINTS[timeRange];
    const volatility = timeRange === '24h' ? 0.01 : 0.03;
    setHistory(generateMockHistory(priceData.price, points, volatility));
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
    if (timeRange === '24h') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeRange === '1m') {
      return date.toLocaleDateString([], { day: 'numeric' });
    } else {
      return date.toLocaleDateString([], { month: 'short' });
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
          <div className="crypto-icon" style={{ backgroundColor: priceData.color }}>
            {priceData.symbol.slice(0, 1)}
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
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={history}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={isPositive ? '#10B981' : '#EF4444'}
                  stopOpacity={0.6}
                />
                <stop
                  offset="50%"
                  stopColor={isPositive ? '#10B981' : '#EF4444'}
                  stopOpacity={0.2}
                />
                <stop
                  offset="100%"
                  stopColor={isPositive ? '#10B981' : '#EF4444'}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatTime}
              stroke="#6B7280"
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              axisLine={{ stroke: '#374151' }}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(v) => formatPrice(v)}
              stroke="#6B7280"
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={70}
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
              stroke={isPositive ? '#10B981' : '#EF4444'}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
