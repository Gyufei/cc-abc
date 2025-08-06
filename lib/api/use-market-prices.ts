import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiPath as _ApiPath } from './api-path';
import { Fetcher as _Fetcher } from '../fetcher';

// Interface for market price data
export interface MarketPrice {
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  lastUpdated: string;
}

// Interface for price API response
export interface MarketPricesResponse {
  code: number;
  msg: string;
  data: MarketPrice[];
}

/**
 * Map trading symbols to CoinGecko coin IDs
 * @param symbol - Trading symbol (e.g., 'BTCUSDT', 'ETHUSDT')
 * @returns CoinGecko coin ID
 */
function mapSymbolToCoinGeckoId(symbol: string): string {
  // Remove USDT suffix and map to CoinGecko IDs
  const baseSymbol = symbol.replace('USDT', '').toLowerCase();
  const symbolMap: Record<string, string> = {
    'btc': 'bitcoin',
    'eth': 'ethereum',
    'bnb': 'binancecoin',
    'ada': 'cardano',
    'sol': 'solana',
    'xrp': 'ripple',
    'dot': 'polkadot',
    'doge': 'dogecoin',
    'avax': 'avalanche-2',
    'matic': 'matic-network',
    'link': 'chainlink',
    'uni': 'uniswap',
    'ltc': 'litecoin',
    'atom': 'cosmos',
    'etc': 'ethereum-classic',
    'xlm': 'stellar',
    'vet': 'vechain',
    'icp': 'internet-computer',
    'fil': 'filecoin',
    'trx': 'tron'
  };
  
  return symbolMap[baseSymbol] || baseSymbol;
}

/**
 * Fetch current market prices from CoinGecko API
 * @param symbols - Array of trading symbols (e.g., ['BTCUSDT', 'ETHUSDT'])
 * @returns Promise with market prices data
 */
export async function fetchMarketPrices(
  symbols: string[]
): Promise<MarketPricesResponse> {
  try {
    // Map symbols to CoinGecko IDs
    const coinIds = symbols.map(mapSymbolToCoinGeckoId);
    const uniqueCoinIds = [...new Set(coinIds)];
    
    // Fetch current prices
    const priceUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${uniqueCoinIds.join(',')}&vs_currencies=usd&include_24hr_change=true`;
    const priceResponse = await fetch(priceUrl);
    
    if (!priceResponse.ok) {
      throw new Error(`CoinGecko API error: ${priceResponse.status}`);
    }
    
    const priceData = await priceResponse.json();
    
    // Transform data to match our interface
    const marketPrices: MarketPrice[] = symbols.map(symbol => {
      const coinId = mapSymbolToCoinGeckoId(symbol);
      const coinData = priceData[coinId];
      
      if (!coinData) {
        // Fallback for unknown symbols
        return {
          symbol,
          price: 0,
          change24h: 0,
          changePercent24h: 0,
          lastUpdated: new Date().toISOString()
        };
      }
      
      const currentPrice = coinData.usd || 0;
      const changePercent24h = coinData.usd_24h_change || 0;
      const change24h = currentPrice * (changePercent24h / 100);
      
      return {
        symbol,
        price: currentPrice,
        change24h,
        changePercent24h,
        lastUpdated: new Date().toISOString()
      };
    });
    
    return {
      code: 200,
      msg: "success",
      data: marketPrices
    };
    
  } catch (error) {
    console.error('Error fetching market prices:', error);
    
    // Return error response
    return {
      code: 500,
      msg: error instanceof Error ? error.message : "Failed to fetch market prices",
      data: []
    };
  }
}

/**
 * Hook to fetch and manage real-time market prices
 * Uses polling strategy with rate limiting consideration
 * @param symbols - Array of symbols to track
 * @param refreshInterval - Refresh interval in milliseconds (default: 30000ms)
 * @returns Object containing prices data, loading state, and error state
 */
export function useMarketPrices(
  symbols: string[],
  refreshInterval: number = 30000
) {
  const [prices, setPrices] = useState<Record<string, MarketPrice>>({});
  
  const query = useQuery({
    queryKey: ['marketPrices', symbols],
    queryFn: () => fetchMarketPrices(symbols),
    enabled: symbols.length > 0,
    staleTime: 25000, // Consider data stale after 25 seconds
    refetchInterval: refreshInterval, // Refetch every 30 seconds by default
    refetchIntervalInBackground: true, // Continue refetching in background
    retry: (failureCount, error) => {
      // Don't retry on rate limiting errors to avoid further throttling
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as Error).message.toLowerCase();
        if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
          return false;
        }
      }
      return failureCount < 2;
    },
    retryDelay: 60000, // Wait 1 minute before retrying
  });
  
  // Update prices when query data changes, but preserve existing data on errors
  useEffect(() => {
    if (query.data && query.data.code === 200 && query.data.data.length > 0) {
      // Only update if we have successful data
      const priceMap = query.data.data.reduce((acc: Record<string, MarketPrice>, price: MarketPrice) => {
        acc[price.symbol] = price;
        return acc;
      }, {} as Record<string, MarketPrice>);
      setPrices(priceMap);
    }
    // If there's an error or rate limiting, keep the existing prices
  }, [query.data]);
  
  /**
   * Get price for a specific symbol
   * @param symbol - Trading symbol
   * @returns Price data or null if not found
   */
  const getPrice = useCallback((symbol: string): MarketPrice | null => {
    return prices[symbol] || null;
  }, [prices]);
  
  /**
   * Get USD price for a symbol (handles USDT as 1.0)
   * @param symbol - Trading symbol
   * @returns USD price or 1.0 for USDT
   */
  const getUsdPrice = useCallback((symbol: string): number => {
    if (symbol === 'USDT') return 1.0;
    const price = getPrice(`${symbol}USDT`);
    return price?.price || 0;
  }, [getPrice]);
  
  return {
    data: prices,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    getPrice,
    getUsdPrice,
    isRefetching: query.isRefetching
  };
}

/**
 * Hook for WebSocket-based real-time price updates (future implementation)
 * This would be used when WebSocket service becomes available
 */
export function useWebSocketPrices(symbols: string[]) {
  const [prices, _setPrices] = useState<Record<string, MarketPrice>>({});
  const [connected, _setConnected] = useState(false);
  const [error, _setError] = useState<string | null>(null);
  
  useEffect(() => {
    // TODO: Implement WebSocket connection when service is available
    // const ws = new WebSocket('wss://api.example.com/ws/prices');
    // 
    // ws.onopen = () => {
    //   setConnected(true);
    //   // Subscribe to symbols
    //   ws.send(JSON.stringify({
    //     action: 'subscribe',
    //     symbols: symbols
    //   }));
    // };
    // 
    // ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   if (data.type === 'price_update') {
    //     setPrices(prev => ({
    //       ...prev,
    //       [data.symbol]: data.price
    //     }));
    //   }
    // };
    // 
    // ws.onerror = (error) => {
    //   setError('WebSocket connection error');
    // };
    // 
    // ws.onclose = () => {
    //   setConnected(false);
    // };
    // 
    // return () => {
    //   ws.close();
    // };
    
    console.log('WebSocket price service not yet implemented');
  }, [symbols]);
  
  return {
    data: prices,
    connected,
    error
  };
}