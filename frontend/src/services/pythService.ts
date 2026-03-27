import { HermesClient } from '@pythnetwork/hermes-client';

// Pyth Hermes public endpoint
const HERMES_ENDPOINT = 'https://hermes.pyth.network';

// Price feeds configuration
// Pyth feeds have actual feed IDs, custom tokens use 'mock' as ID
export const PRICE_FEEDS = {
  SOL: {
    id: '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
    name: 'Solana',
    symbol: 'SOL',
    isMock: false,
  },
  BTC: {
    id: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
    name: 'Bitcoin',
    symbol: 'BTC',
    isMock: false,
  },
  ETH: {
    id: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
    name: 'Ethereum',
    symbol: 'ETH',
    isMock: false,
  },
  PENGUIN: {
    id: 'mock',
    name: 'Penguin',
    symbol: 'PENGUIN',
    isMock: true,
    mintAddress: '8Jx8AAHj86wbQgUTjGuj6GTTL5Ps3cqxKRTvpaJApump',
    basePrice: 0.00042,
  },
  K2: {
    id: 'mock',
    name: 'K2',
    symbol: 'K2',
    isMock: true,
    mintAddress: '8aZEym6Uv5vuy2LQ9BYNSiSiiKS3JKJEhbiUgpQppump',
    basePrice: 0.00018,
  },
  SHARK: {
    id: 'mock',
    name: 'Shark',
    symbol: 'SHARK',
    isMock: true,
    mintAddress: '63Z3Q7JX3SBGDiiwqqnPTVvHcuUk6ixkzsYQbKzhpump',
    basePrice: 0.00085,
  },
  DOGE: {
    id: '0xdcef50dd0a4cd2dcc17e45df1676dcb336a11a61c69df7a0299b0150c672d25c',
    name: 'Dogecoin',
    symbol: 'DOGE',
    isMock: false,
  },
  PEPE: {
    id: '0xd69731a2e74ac1ce884fc3890f7ee324b6deb66147055249568869ed700882e4',
    name: 'Pepe',
    symbol: 'PEPE',
    isMock: false,
  },
  AVAX: {
    id: '0x93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7',
    name: 'Avalanche',
    symbol: 'AVAX',
    isMock: false,
  },
} as const;

export type CryptoSymbol = keyof typeof PRICE_FEEDS;

export interface PriceData {
  symbol: CryptoSymbol;
  name: string;
  price: number;
  confidence: number;
  timestamp: number;
  change24h?: number;
  isMock?: boolean;
}

export interface PriceHistoryPoint {
  timestamp: number;
  price: number;
}

// Create Hermes client instance
const hermesClient = new HermesClient(HERMES_ENDPOINT);

// Store for mock token prices (simulates live price movement)
const mockPriceStore: Record<string, { price: number; lastUpdate: number }> = {};

// Generate simulated price for mock tokens
function getMockPrice(symbol: CryptoSymbol): PriceData {
  const feed = PRICE_FEEDS[symbol];
  if (!('basePrice' in feed)) {
    throw new Error(`${symbol} is not a mock token`);
  }

  const now = Date.now();
  const stored = mockPriceStore[symbol];

  let price: number;
  if (stored && now - stored.lastUpdate < 1000) {
    // Use cached price if less than 1 second old
    price = stored.price;
  } else {
    // Generate new price with small random movement
    const basePrice = feed.basePrice;
    const variance = basePrice * 0.15; // 15% variance
    const randomFactor = (Math.random() - 0.5) * 2;

    if (stored) {
      // Small incremental change from last price
      const change = stored.price * (Math.random() - 0.5) * 0.02;
      price = Math.max(stored.price + change, basePrice * 0.5);
      price = Math.min(price, basePrice * 1.5);
    } else {
      price = basePrice + randomFactor * variance;
    }

    mockPriceStore[symbol] = { price, lastUpdate: now };
  }

  return {
    symbol,
    name: feed.name,
    price,
    confidence: price * 0.001,
    timestamp: now,
    isMock: true,
  };
}

// Parse Pyth price data
function parsePythPrice(priceData: {
  price: string;
  conf: string;
  expo: number;
  publish_time: number;
}): { price: number; confidence: number; timestamp: number } {
  const price = Number(priceData.price) * Math.pow(10, priceData.expo);
  const confidence = Number(priceData.conf) * Math.pow(10, priceData.expo);
  return { price, confidence, timestamp: priceData.publish_time * 1000 };
}

// Fetch latest prices for all feeds using HermesClient
export async function fetchAllPrices(): Promise<PriceData[]> {
  // Separate Pyth feeds from mock feeds
  const pythFeeds = Object.entries(PRICE_FEEDS).filter(([, feed]) => !feed.isMock);
  const mockFeeds = Object.entries(PRICE_FEEDS).filter(([, feed]) => feed.isMock);

  const feedIds = pythFeeds.map(([, feed]) => feed.id);
  const prices: PriceData[] = [];

  // Get mock prices first (always available)
  for (const [symbol] of mockFeeds) {
    try {
      prices.push(getMockPrice(symbol as CryptoSymbol));
    } catch (e) {
      console.error(`Error generating mock price for ${symbol}:`, e);
    }
  }

  try {
    const priceUpdates = await hermesClient.getLatestPriceUpdates(feedIds);

    if (!priceUpdates?.parsed || !Array.isArray(priceUpdates.parsed)) {
      throw new Error('Invalid response format from Pyth');
    }

    for (const update of priceUpdates.parsed) {
      // The response ID doesn't have 0x prefix, so we need to match without it
      const responseId = update.id.toLowerCase();
      const feedEntry = pythFeeds.find(
        ([, feed]) => feed.id.toLowerCase().replace('0x', '') === responseId
      );

      if (feedEntry && update.price) {
        const [symbol, feed] = feedEntry;
        const { price, confidence, timestamp } = parsePythPrice(update.price);

        prices.push({
          symbol: symbol as CryptoSymbol,
          name: feed.name,
          price,
          confidence,
          timestamp,
        });
      }
    }

    // Sort by the order defined in PRICE_FEEDS
    const order = Object.keys(PRICE_FEEDS);
    prices.sort((a, b) => order.indexOf(a.symbol) - order.indexOf(b.symbol));

    return prices;
  } catch (error) {
    console.error('Error fetching all prices from Pyth, trying individual feeds:', error);
    // Fallback: fetch prices individually for resilience
    const pythPrices = await fetchPricesIndividually();
    return [...prices, ...pythPrices].sort((a, b) => {
      const order = Object.keys(PRICE_FEEDS);
      return order.indexOf(a.symbol) - order.indexOf(b.symbol);
    });
  }
}

// Fallback function to fetch prices one by one
async function fetchPricesIndividually(): Promise<PriceData[]> {
  const prices: PriceData[] = [];
  const pythFeeds = Object.entries(PRICE_FEEDS).filter(([, feed]) => !feed.isMock);

  const results = await Promise.allSettled(
    pythFeeds.map(async ([symbol, feed]) => {
      const priceUpdates = await hermesClient.getLatestPriceUpdates([feed.id]);

      if (!priceUpdates?.parsed?.[0]?.price) {
        throw new Error(`No price data for ${symbol}`);
      }

      const update = priceUpdates.parsed[0];
      const { price, confidence, timestamp } = parsePythPrice(update.price);

      return {
        symbol: symbol as CryptoSymbol,
        name: feed.name,
        price,
        confidence,
        timestamp,
      } as PriceData;
    })
  );

  for (const result of results) {
    if (result.status === 'fulfilled') {
      prices.push(result.value);
    }
  }

  // Sort by the order defined in PRICE_FEEDS
  const order = Object.keys(PRICE_FEEDS);
  prices.sort((a, b) => order.indexOf(a.symbol) - order.indexOf(b.symbol));

  if (prices.length === 0) {
    throw new Error('Failed to fetch any price data');
  }

  return prices;
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
    const { price, confidence, timestamp } = parsePythPrice(update.price);

    return {
      symbol,
      name: feed.name,
      price,
      confidence,
      timestamp,
    };
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    throw error;
  }
}

// Generate mock historical data (Pyth doesn't provide historical via Hermes)
export function generateMockHistory(
  currentPrice: number,
  points: number = 50,
  volatility: number = 0.02,
  intervalMs?: number
): PriceHistoryPoint[] {
  const history: PriceHistoryPoint[] = [];
  const now = Date.now();
  // Use provided interval or default to spread across 24 hours
  const interval = intervalMs || (24 * 60 * 60 * 1000) / points;

  // Start closer to current price with mild variance
  let price = currentPrice * (0.97 + Math.random() * 0.03);

  for (let i = 0; i < points; i++) {
    // Balanced random walk (no bias)
    const change = (Math.random() - 0.5) * volatility * price;
    price = price + change;

    // Keep price within reasonable bounds (±10% of current)
    price = Math.max(price, currentPrice * 0.9);
    price = Math.min(price, currentPrice * 1.1);

    // Gradually trend toward current price in last 30%
    if (i > points * 0.7) {
      price = price + (currentPrice - price) * 0.15;
    }

    history.push({
      timestamp: now - (points - i) * interval,
      price,
    });
  }

  // Ensure last point is exactly current price
  history[history.length - 1].price = currentPrice;

  return history;
}

// Subscribe to price updates via SSE (Server-Sent Events)
export function subscribeToPrices(
  symbols: CryptoSymbol[],
  onUpdate: (prices: PriceData[]) => void
): () => void {
  // Separate Pyth feeds from mock feeds
  const pythSymbols = symbols.filter((s) => !PRICE_FEEDS[s].isMock);
  const mockSymbols = symbols.filter((s) => PRICE_FEEDS[s].isMock);

  const feedIds = pythSymbols.map((s) => PRICE_FEEDS[s].id);
  let eventSource: EventSource | null = null;
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  let mockInterval: ReturnType<typeof setInterval> | null = null;

  // Update mock prices periodically
  if (mockSymbols.length > 0) {
    mockInterval = setInterval(() => {
      const mockPrices: PriceData[] = [];
      for (const symbol of mockSymbols) {
        try {
          mockPrices.push(getMockPrice(symbol));
        } catch (e) {
          console.error(`Error getting mock price for ${symbol}:`, e);
        }
      }
      if (mockPrices.length > 0) {
        onUpdate(mockPrices);
      }
    }, 2000); // Update mock prices every 2 seconds
  }

  const connect = () => {
    if (feedIds.length === 0) return;

    // Use the correct URL format with 0x prefix IDs
    const idsParam = feedIds.map((id) => `ids[]=${id}`).join('&');
    const url = `${HERMES_ENDPOINT}/v2/updates/price/stream?${idsParam}`;

    try {
      eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.parsed) {
            const prices: PriceData[] = [];

            for (const update of data.parsed) {
              const responseId = update.id.toLowerCase();
              const feedEntry = Object.entries(PRICE_FEEDS).find(
                ([, feed]) => !feed.isMock && feed.id.toLowerCase().replace('0x', '') === responseId
              );

              if (feedEntry && update.price) {
                const [symbol, feed] = feedEntry;
                const { price, confidence, timestamp } = parsePythPrice(update.price);

                prices.push({
                  symbol: symbol as CryptoSymbol,
                  name: feed.name,
                  price,
                  confidence,
                  timestamp,
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
        reconnectTimeout = setTimeout(connect, 5000);
      };
    } catch (error) {
      console.error('Error connecting to SSE:', error);
      reconnectTimeout = setTimeout(connect, 5000);
    }
  };

  connect();

  return () => {
    eventSource?.close();
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
    }
    if (mockInterval) {
      clearInterval(mockInterval);
    }
  };
}
