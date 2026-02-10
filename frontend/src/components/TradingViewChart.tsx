import { useEffect, useRef, useState } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  Time,
  CandlestickSeries,
  HistogramSeries,
} from 'lightweight-charts';
import { PriceData } from '../services/pythService';

interface TradingViewChartProps {
  priceData: PriceData;
  timeRange: string;
}

// Time range to candle interval mapping (in seconds)
const CANDLE_INTERVALS: Record<string, { interval: number; points: number; volatility: number }> = {
  '1m': { interval: 1, points: 60, volatility: 0.002 },           // 1 sec candles for 1 min view
  '5m': { interval: 5, points: 60, volatility: 0.003 },           // 5 sec candles for 5 min view
  '15m': { interval: 15, points: 60, volatility: 0.005 },         // 15 sec candles for 15 min view
  '1h': { interval: 60, points: 60, volatility: 0.008 },          // 1 min candles for 1 hour view
  '4h': { interval: 300, points: 48, volatility: 0.01 },          // 5 min candles for 4 hour view
  '12h': { interval: 600, points: 72, volatility: 0.012 },        // 10 min candles for 12 hour view
  '1d': { interval: 1800, points: 48, volatility: 0.015 },        // 30 min candles for 1 day view
  '1w': { interval: 7200, points: 84, volatility: 0.02 },         // 2 hour candles for 1 week view
  '1mo': { interval: 43200, points: 60, volatility: 0.03 },       // 12 hour candles for 1 month view
};

// Generate candlestick data from price history
function generateCandlestickData(currentPrice: number, timeRange: string): CandlestickData<Time>[] {
  const config = CANDLE_INTERVALS[timeRange] || CANDLE_INTERVALS['1d'];
  const { interval, points, volatility: volPercent } = config;

  const data: CandlestickData<Time>[] = [];
  const now = Math.floor(Date.now() / 1000);

  let price = currentPrice * (0.85 + Math.random() * 0.1);

  for (let i = 0; i < points; i++) {
    const time = (now - (points - i) * interval) as Time;
    const volatility = currentPrice * volPercent;

    const open = price;
    const close = open + (Math.random() - 0.48) * volatility;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;

    data.push({
      time,
      open,
      high,
      low,
      close,
    });

    price = close;
  }

  // Ensure last candle closes at current price
  if (data.length > 0) {
    data[data.length - 1].close = currentPrice;
  }

  return data;
}

export function TradingViewChart({ priceData, timeRange }: TradingViewChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const [showIndicators, setShowIndicators] = useState(false);

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
    candleSeries.setData(candleData);

    // Generate volume data
    const volumeData = candleData.map((candle) => ({
      time: candle.time,
      value: Math.random() * 1000000 + 100000,
      color: candle.close >= candle.open ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 51, 51, 0.3)',
    }));
    volumeSeries.setData(volumeData);

    chart.timeScale().fitContent();

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
      candleSeriesRef.current.setData(candleData);

      if (volumeSeriesRef.current) {
        const volumeData = candleData.map((candle) => ({
          time: candle.time,
          value: Math.random() * 1000000 + 100000,
          color: candle.close >= candle.open ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 51, 51, 0.3)',
        }));
        volumeSeriesRef.current.setData(volumeData);
      }

      chartRef.current.timeScale().fitContent();
    }
  }, [priceData.price, timeRange]);

  const addSMA = () => {
    if (!chartRef.current || !candleSeriesRef.current) return;

    // This would add SMA indicator - for now just toggle state
    setShowIndicators(!showIndicators);
  };

  return (
    <div className="tradingview-wrapper">
      <div className="tv-toolbar">
        <button className="tv-tool-btn" onClick={addSMA}>
          {showIndicators ? 'Hide' : 'Show'} Indicators
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
