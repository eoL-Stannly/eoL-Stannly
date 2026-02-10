import { useEffect, useRef, useState } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  Time,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  LineData,
} from 'lightweight-charts';
import { PriceData } from '../services/pythService';

// Calculate Simple Moving Average
function calculateSMA(data: CandlestickData<Time>[], period: number): LineData<Time>[] {
  const smaData: LineData<Time>[] = [];

  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    smaData.push({
      time: data[i].time,
      value: sum / period,
    });
  }

  return smaData;
}

interface TradingViewChartProps {
  priceData: PriceData;
  timeRange: string;
}

// Time range to candle interval mapping (in seconds)
const CANDLE_INTERVALS: Record<string, { interval: number; points: number; volatility: number }> = {
  '1m': { interval: 1, points: 60, volatility: 0.0005 },          // 1 sec candles for 1 min view
  '5m': { interval: 5, points: 60, volatility: 0.0008 },          // 5 sec candles for 5 min view
  '15m': { interval: 15, points: 60, volatility: 0.001 },         // 15 sec candles for 15 min view
  '1h': { interval: 60, points: 60, volatility: 0.0015 },         // 1 min candles for 1 hour view
  '4h': { interval: 300, points: 48, volatility: 0.002 },         // 5 min candles for 4 hour view
  '12h': { interval: 600, points: 72, volatility: 0.003 },        // 10 min candles for 12 hour view
  '1d': { interval: 1800, points: 48, volatility: 0.004 },        // 30 min candles for 1 day view
  '1w': { interval: 7200, points: 84, volatility: 0.006 },        // 2 hour candles for 1 week view
  '1mo': { interval: 43200, points: 60, volatility: 0.008 },      // 12 hour candles for 1 month view
};

// Generate candlestick data from price history
function generateCandlestickData(currentPrice: number, timeRange: string): CandlestickData<Time>[] {
  const config = CANDLE_INTERVALS[timeRange] || CANDLE_INTERVALS['1d'];
  const { interval, points, volatility: volPercent } = config;

  const data: CandlestickData<Time>[] = [];
  const now = Math.floor(Date.now() / 1000);

  // Start closer to current price (within 3%)
  let price = currentPrice * (0.97 + Math.random() * 0.03);

  for (let i = 0; i < points; i++) {
    const time = (now - (points - i) * interval) as Time;
    const volatility = currentPrice * volPercent;

    const open = price;
    // Balanced random walk (no bias)
    const close = open + (Math.random() - 0.5) * volatility * 2;
    const high = Math.max(open, close) + Math.random() * volatility * 0.3;
    const low = Math.min(open, close) - Math.random() * volatility * 0.3;

    // Keep price within reasonable bounds (±5% of current)
    const boundedClose = Math.max(Math.min(close, currentPrice * 1.05), currentPrice * 0.95);

    data.push({
      time,
      open: Math.max(Math.min(open, currentPrice * 1.05), currentPrice * 0.95),
      high: Math.max(Math.min(high, currentPrice * 1.06), currentPrice * 0.94),
      low: Math.max(Math.min(low, currentPrice * 1.06), currentPrice * 0.94),
      close: boundedClose,
    });

    // Gradually trend toward current price in last 30%
    if (i > points * 0.7) {
      price = price + (currentPrice - price) * 0.15;
    } else {
      price = boundedClose;
    }
  }

  // Ensure last candle closes at current price
  if (data.length > 0) {
    const last = data[data.length - 1];
    last.close = currentPrice;
    last.high = Math.max(last.high, currentPrice);
    last.low = Math.min(last.low, currentPrice);
  }

  return data;
}

export function TradingViewChart({ priceData, timeRange }: TradingViewChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const sma20SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const sma50SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const [showIndicators, setShowIndicators] = useState(false);
  const candleDataRef = useRef<CandlestickData<Time>[]>([]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#0a0a0a' },
        textColor: '#cccccc',
      },
      grid: {
        vertLines: { color: '#1a1a1a' },
        horzLines: { color: '#1a1a1a' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#00ff00',
          width: 1,
          style: 2,
          labelBackgroundColor: '#009900',
        },
        horzLine: {
          color: '#00ff00',
          width: 1,
          style: 2,
          labelBackgroundColor: '#009900',
        },
      },
      rightPriceScale: {
        borderColor: '#1a1a1a',
      },
      timeScale: {
        borderColor: '#1a1a1a',
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    chartRef.current = chart;

    // Add candlestick series (v5 API)
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#00ff00',
      downColor: '#ff3333',
      borderUpColor: '#00ff00',
      borderDownColor: '#ff3333',
      wickUpColor: '#00ff00',
      wickDownColor: '#ff3333',
    });

    candleSeriesRef.current = candleSeries;

    // Add volume series (v5 API)
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    volumeSeriesRef.current = volumeSeries;

    // Generate and set data
    const candleData = generateCandlestickData(priceData.price, timeRange);
    candleDataRef.current = candleData;
    candleSeries.setData(candleData);

    // Generate volume data
    const volumeData = candleData.map((candle) => ({
      time: candle.time,
      value: Math.random() * 1000000 + 100000,
      color: candle.close >= candle.open ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 51, 51, 0.3)',
    }));
    volumeSeries.setData(volumeData);

    chart.timeScale().fitContent();

    // Clean up SMA series refs on chart recreation
    sma20SeriesRef.current = null;
    sma50SeriesRef.current = null;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [priceData.symbol, timeRange]);

  // Update data when price or timeRange changes
  useEffect(() => {
    if (candleSeriesRef.current && chartRef.current) {
      const candleData = generateCandlestickData(priceData.price, timeRange);
      candleDataRef.current = candleData;
      candleSeriesRef.current.setData(candleData);

      if (volumeSeriesRef.current) {
        const volumeData = candleData.map((candle) => ({
          time: candle.time,
          value: Math.random() * 1000000 + 100000,
          color: candle.close >= candle.open ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 51, 51, 0.3)',
        }));
        volumeSeriesRef.current.setData(volumeData);
      }

      // Update SMA indicators if visible
      if (showIndicators && sma20SeriesRef.current && sma50SeriesRef.current) {
        const sma20Data = calculateSMA(candleData, 20);
        const sma50Data = calculateSMA(candleData, 50);
        sma20SeriesRef.current.setData(sma20Data);
        sma50SeriesRef.current.setData(sma50Data);
      }

      chartRef.current.timeScale().fitContent();
    }
  }, [priceData.price, timeRange, showIndicators]);

  const toggleIndicators = () => {
    if (!chartRef.current) return;

    if (showIndicators) {
      // Remove SMA lines
      if (sma20SeriesRef.current) {
        chartRef.current.removeSeries(sma20SeriesRef.current);
        sma20SeriesRef.current = null;
      }
      if (sma50SeriesRef.current) {
        chartRef.current.removeSeries(sma50SeriesRef.current);
        sma50SeriesRef.current = null;
      }
    } else {
      // Add SMA lines
      const sma20Series = chartRef.current.addSeries(LineSeries, {
        color: '#ffcc00',
        lineWidth: 2,
        title: 'SMA 20',
      });
      sma20SeriesRef.current = sma20Series;

      const sma50Series = chartRef.current.addSeries(LineSeries, {
        color: '#00ccff',
        lineWidth: 2,
        title: 'SMA 50',
      });
      sma50SeriesRef.current = sma50Series;

      // Calculate and set SMA data
      const candleData = candleDataRef.current;
      if (candleData.length > 0) {
        const sma20Data = calculateSMA(candleData, 20);
        const sma50Data = calculateSMA(candleData, 50);
        sma20Series.setData(sma20Data);
        sma50Series.setData(sma50Data);
      }
    }

    setShowIndicators(!showIndicators);
  };

  return (
    <div className="tradingview-wrapper">
      <div className="tv-toolbar">
        <button className="tv-tool-btn" onClick={toggleIndicators}>
          {showIndicators ? 'Hide' : 'Show'} SMA (20/50)
        </button>
        <span className="tv-symbol">{priceData.symbol}/USD</span>
      </div>
      <div ref={chartContainerRef} className="tradingview-container" />
      <div className="tv-footer">
        <span className="tv-powered">Powered by TradingView Lightweight Charts</span>
      </div>
      <style>{`
        .tradingview-wrapper {
          width: 100%;
        }
        .tv-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-bottom: none;
        }
        .tv-tool-btn {
          padding: 0.4rem 0.8rem;
          background: transparent;
          border: 1px solid var(--green-dark);
          color: var(--green-dim);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .tv-tool-btn:hover {
          border-color: var(--green-primary);
          color: var(--green-primary);
        }
        .tv-symbol {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          color: var(--green-primary);
        }
        .tv-footer {
          padding: 0.25rem 0.5rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-top: none;
          text-align: right;
        }
        .tv-powered {
          font-size: 0.65rem;
          color: var(--text-dim);
        }
      `}</style>
    </div>
  );
}
