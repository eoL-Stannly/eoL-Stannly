// Pyth Hermes public endpoint
const HERMES_ENDPOINT = 'https://hermes.pyth.network';

// Top 10 cryptocurrency price feed IDs (by volume)
// Source: https://pyth.network/developers/price-feed-ids
export const PRICE_FEEDS = {
  SOL: {
    id: 'ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
    name: 'Solana',
    symbol: 'SOL',
  },
  BTC: {
    id: 'e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
    name: 'Bitcoin',
    symbol: 'BTC',
  },
  ETH: {
    id: 'ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
    name: 'Ethereum',
    symbol: 'ETH',
  },
  BNB: {
    id: '2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f',
    name: 'BNB',
    symbol: 'BNB',
  },
  XRP: {
    id: 'ec5d399846a9209f3fe5881d70aae9268c94339ff9817e8d18ff19fa05eea1c8',
    name: 'XRP',
    symbol: 'XRP',
  },
  ADA: {
    id: '2a01deaec9e51a579277b34b122399984d0bbf57e2458a7e42fecd2829867a0d',
    name: 'Cardano',
    symbol: 'ADA',
  },
  DOGE: {
    id: 'dcef50dd0a4cd2dcc17e45df1676dcb336a11a61c69df7a0299b0150c672d25c',
    name: 'Dogecoin',
    symbol: 'DOGE',
  },
  AVAX: {
    id: '93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7',
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  DOT: {
    id: 'ca3eed9b267293f6595901c734c7525ce8ef49adafe8284f36f83a3d7573e5d5',
    name: 'Polkadot',
    symbol: 'DOT',
  },
  MATIC: {
    id: '5de33440f6c5bc7d572f089c47da68c5e1a85c2f5d7df4b0cf37e2f7f04e5a40',
    name: 'Polygon',
    symbol: 'MATIC',
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
}

export interface PriceHistoryPoint {
  timestamp: number;
  price: number;
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

// Fetch latest prices for all feeds using native fetch
export async function fetchAllPrices(): Promise<PriceData[]> {
  const feedIds = Object.values(PRICE_FEEDS).map((feed) => feed.id);
  const idsParam = feedIds.map((id) => `ids[]=${id}`).join('&');
  const url = `${HERMES_ENDPOINT}/v2/updates/price/latest?${idsParam}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data?.parsed || !Array.isArray(data.parsed)) {
      throw new Error('Invalid response format');
    }

    const prices: PriceData[] = [];

    for (const update of data.parsed) {
      const feedId = update.id;
      const feedEntry = Object.entries(PRICE_FEEDS).find(
        ([, feed]) => feed.id.toLowerCase() === feedId.toLowerCase()
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
    console.error('Error fetching prices:', error);
    throw error;
  }
}

// Fetch price for a single feed
export async function fetchPrice(symbol: CryptoSymbol): Promise<PriceData> {
  const feed = PRICE_FEEDS[symbol];
  const url = `${HERMES_ENDPOINT}/v2/updates/price/latest?ids[]=${feed.id}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data?.parsed?.[0]?.price) {
      throw new Error(`No price data for ${symbol}`);
    }

    const update = data.parsed[0];
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
  volatility: number = 0.02
): PriceHistoryPoint[] {
  const history: PriceHistoryPoint[] = [];
  const now = Date.now();
  const interval = (24 * 60 * 60 * 1000) / points;

  let price = currentPrice * (1 - volatility * points * 0.3);

  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.45) * volatility * price;
    price = Math.max(price + change, price * 0.9);

    if (i > points * 0.7) {
      price = price + (currentPrice - price) * 0.1;
    }

    history.push({
      timestamp: now - (points - i) * interval,
      price,
    });
  }

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
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  const connect = () => {
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
              const feedId = update.id;
              const feedEntry = Object.entries(PRICE_FEEDS).find(
                ([, feed]) => feed.id.toLowerCase() === feedId.toLowerCase()
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
  };
}
