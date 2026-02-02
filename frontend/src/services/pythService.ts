import { HermesClient } from '@pythnetwork/hermes-client';

// Pyth Hermes public endpoint
const HERMES_ENDPOINT = 'https://hermes.pyth.network';

// Top 10 cryptocurrency price feed IDs (by volume)
// Source: https://pyth.network/developers/price-feed-ids
export const PRICE_FEEDS = {
  SOL: {
    id: '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
    name: 'Solana',
    symbol: 'SOL',
    color: '#9945FF',
  },
  BTC: {
    id: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
    name: 'Bitcoin',
    symbol: 'BTC',
    color: '#F7931A',
  },
  ETH: {
    id: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
    name: 'Ethereum',
    symbol: 'ETH',
    color: '#627EEA',
  },
  BNB: {
    id: '0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f',
    name: 'BNB',
    symbol: 'BNB',
    color: '#F3BA2F',
  },
  XRP: {
    id: '0xec5d399846a9209f3fe5881d70aae9268c94339ff9817e8d18ff19fa05eea1c8',
    name: 'XRP',
    symbol: 'XRP',
    color: '#23292F',
  },
  ADA: {
    id: '0x2a01deaec9e51a579277b34b122399984d0bbf57e2458a7e42fecd2829867a0d',
    name: 'Cardano',
    symbol: 'ADA',
    color: '#0033AD',
  },
  DOGE: {
    id: '0xdcef50dd0a4cd2dcc17e45df1676dcb336a11a61c69df7a0299b0150c672d25c',
    name: 'Dogecoin',
    symbol: 'DOGE',
    color: '#C2A633',
  },
  AVAX: {
    id: '0x93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7',
    name: 'Avalanche',
    symbol: 'AVAX',
    color: '#E84142',
  },
  DOT: {
    id: '0xca3eed9b267293f6595901c734c7525ce8ef49adafe8284f36f83a3d7573e5d5',
    name: 'Polkadot',
    symbol: 'DOT',
    color: '#E6007A',
  },
  MATIC: {
    id: '0x5de33440f6c5bc7d572f089c47da68c5e1a85c2f5d7df4b0cf37e2f7f04e5a40',
    name: 'Polygon',
    symbol: 'MATIC',
    color: '#8247E5',
  },
} as const;

export type CryptoSymbol = keyof typeof PRICE_FEEDS;

export interface PriceData {
  symbol: CryptoSymbol;
  name: string;
  price: number;
  confidence: number;
  timestamp: number;
  color: string;
  change24h?: number;
}

export interface PriceHistoryPoint {
  timestamp: number;
  price: number;
}

// Create Hermes client
const hermesClient = new HermesClient(HERMES_ENDPOINT);

// Parse Pyth price data
function parsePythPrice(priceData: any): { price: number; confidence: number } {
  const price = Number(priceData.price) * Math.pow(10, priceData.expo);
  const confidence = Number(priceData.conf) * Math.pow(10, priceData.expo);
  return { price, confidence };
}

// Fetch latest prices for all feeds
export async function fetchAllPrices(): Promise<PriceData[]> {
  const feedIds = Object.values(PRICE_FEEDS).map((feed) => feed.id);

  try {
    const priceUpdates = await hermesClient.getLatestPriceUpdates(feedIds);

    if (!priceUpdates?.parsed) {
      throw new Error('No price data received');
    }

    const prices: PriceData[] = [];

    for (const update of priceUpdates.parsed) {
      const feedId = '0x' + update.id;
      const feedEntry = Object.entries(PRICE_FEEDS).find(
        ([, feed]) => feed.id.toLowerCase() === feedId.toLowerCase()
      );

      if (feedEntry && update.price) {
        const [symbol, feed] = feedEntry;
        const { price, confidence } = parsePythPrice(update.price);

        prices.push({
          symbol: symbol as CryptoSymbol,
          name: feed.name,
          price,
          confidence,
          timestamp: Number(update.price.publish_time) * 1000,
          color: feed.color,
        });
      }
    }

    // Sort by the order defined in PRICE_FEEDS
    const order = Object.keys(PRICE_FEEDS);
    prices.sort((a, b) => order.indexOf(a.symbol) - order.indexOf(b.symbol));

    return prices;
  } catch (error) {
    console.error('Error fetching prices:', error);
    throw error;
  }
}

// Fetch price for a single feed
export async function fetchPrice(symbol: CryptoSymbol): Promise<PriceData> {
  const feed = PRICE_FEEDS[symbol];

  try {
    const priceUpdates = await hermesClient.getLatestPriceUpdates([feed.id]);

    if (!priceUpdates?.parsed?.[0]?.price) {
      throw new Error(`No price data for ${symbol}`);
    }

    const update = priceUpdates.parsed[0];
    const { price, confidence } = parsePythPrice(update.price);

    return {
      symbol,
      name: feed.name,
      price,
      confidence,
      timestamp: Number(update.price.publish_time) * 1000,
      color: feed.color,
    };
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    throw error;
  }
}

// Generate mock historical data (Pyth doesn't provide historical via Hermes)
// In production, you'd use a historical data service
export function generateMockHistory(
  currentPrice: number,
  points: number = 50,
  volatility: number = 0.02
): PriceHistoryPoint[] {
  const history: PriceHistoryPoint[] = [];
  const now = Date.now();
  const interval = (24 * 60 * 60 * 1000) / points; // 24 hours spread

  let price = currentPrice * (1 - volatility * points * 0.3); // Start lower

  for (let i = 0; i < points; i++) {
    // Random walk with slight upward bias to reach current price
    const change = (Math.random() - 0.45) * volatility * price;
    price = Math.max(price + change, price * 0.9);

    // Ensure we trend toward current price
    if (i > points * 0.7) {
      price = price + (currentPrice - price) * 0.1;
    }

    history.push({
      timestamp: now - (points - i) * interval,
      price,
    });
  }

  // Ensure last point is current price
  history[history.length - 1].price = currentPrice;

  return history;
}

// Subscribe to price updates via SSE (Server-Sent Events)
export function subscribeToPrices(
  symbols: CryptoSymbol[],
  onUpdate: (prices: PriceData[]) => void
): () => void {
  const feedIds = symbols.map((s) => PRICE_FEEDS[s].id);
  let eventSource: EventSource | null = null;

  const connect = () => {
    const url = `${HERMES_ENDPOINT}/v2/updates/price/stream?ids[]=${feedIds.join('&ids[]=')}`;
    eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.parsed) {
          const prices: PriceData[] = [];

          for (const update of data.parsed) {
            const feedId = '0x' + update.id;
            const feedEntry = Object.entries(PRICE_FEEDS).find(
              ([, feed]) => feed.id.toLowerCase() === feedId.toLowerCase()
            );

            if (feedEntry && update.price) {
              const [symbol, feed] = feedEntry;
              const { price, confidence } = parsePythPrice(update.price);

              prices.push({
                symbol: symbol as CryptoSymbol,
                name: feed.name,
                price,
                confidence,
                timestamp: Number(update.price.publish_time) * 1000,
                color: feed.color,
              });
            }
          }

          if (prices.length > 0) {
            onUpdate(prices);
          }
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.onerror = () => {
      eventSource?.close();
      // Reconnect after 5 seconds
      setTimeout(connect, 5000);
    };
  };

  connect();

  // Return cleanup function
  return () => {
    eventSource?.close();
  };
}
