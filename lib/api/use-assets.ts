import { useEffect, useState } from 'react';

import { useCurrentApiKey } from '@/lib/hooks/use-current-api-key';

import { Fetcher as _Fetcher } from '../fetcher';
import { ApiPath as _ApiPath } from './api-path';
import { useMarketPrices } from './use-market-prices';

// Interface for asset item from API
export interface AssetItem {
  symbol: string;
  total: number;
  available: number;
  frozen: number;
}

// Interface for API response
export interface AssetsResponse {
  code: number;
  msg: string;
  data: {
    account_type: string;
    assets: AssetItem[];
  };
}

// Interface for table display data
export interface AssetTableData {
  id: string;
  coin: string;
  netAssetValue: string;
  netAssetValueUsd: string;
  balance: string;
  sportCost: string;
  lastPrice: string;
  pnl: string;
}

/**
 * Fetch assets from API
 * @param apiKey - API key for authentication
 * @param accountType - Account type (unified, funding, etc.)
 * @returns Promise with assets data
 */
export async function fetchAssets(
  _apiKey: string,
  _accountType: string = 'unified'
): Promise<AssetsResponse> {
  // Mock data for now - replace with real API call when service is ready
  await new Promise((resolve) => setTimeout(resolve, 500));

  const mockData: AssetsResponse = {
    code: 200,
    msg: 'success',
    data: {
      account_type: 'funding',
      assets: [
        {
          symbol: 'BTC',
          total: 0.298,
          available: 0.298,
          frozen: 0,
        },
        {
          symbol: 'USDT',
          total: 11730,
          available: 11730,
          frozen: 0,
        },
      ],
    },
  };

  return mockData;

  // Real API call implementation (commented out for now)
  /*
  const params = new URLSearchParams({
    account_type: accountType,
    api_key: apiKey
  });
  
  const url = `${ApiPath.tradingAssets}?${params.toString()}`;
  
  const response = await Fetcher.get(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch assets: ${response.statusText}`);
  }
  
  return response.json();
  */
}

/**
 * Transform API data to table display format
 * @param assets - Raw asset data from API
 * @param getUsdPrice - Function to get USD price for a symbol
 * @returns Transformed data for table display
 */
function transformAssetData(
  assets: AssetItem[],
  getUsdPrice: (symbol: string) => number
): AssetTableData[] {
  return assets.map((asset, index) => {
    const usdPrice = getUsdPrice(asset.symbol);
    const netAssetValueUsd = asset.total * usdPrice;

    return {
      id: `${asset.symbol}-${index}`,
      coin: asset.symbol,
      netAssetValue: asset.total.toFixed(8),
      netAssetValueUsd: `≈${netAssetValueUsd.toFixed(2)} USD`,
      balance: asset.available.toFixed(8),
      sportCost: '--',
      lastPrice: asset.symbol === 'USDT' ? '1.00 USD' : `${usdPrice.toFixed(2)} USD`,
      pnl: '--',
    };
  });
}

/**
 * Hook to fetch and manage assets data with real-time price updates
 * @param accountType - Account type filter
 * @returns Object containing assets data, loading state, and error state
 */
export function useAssets(accountType: string = 'unified') {
  const [data, setData] = useState<AssetTableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assetsData, setAssetsData] = useState<AssetItem[]>([]);

  const { data: currentApiKeyData } = useCurrentApiKey();

  // Get symbols for price tracking
  const priceSymbols = assetsData
    .filter((asset) => asset.symbol !== 'USDT')
    .map((asset) => `${asset.symbol}USDT`);

  // Use real-time price service
  const { getUsdPrice, loading: pricesLoading } = useMarketPrices(
    priceSymbols,
    5000 // Update every 5 seconds
  );

  // Load assets data
  useEffect(() => {
    if (!currentApiKeyData?.api_key) {
      setLoading(false);
      setError('No API key available');
      return;
    }

    const loadAssets = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchAssets(currentApiKeyData.api_key, accountType);
        setAssetsData(response.data.assets);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load assets');
      } finally {
        setLoading(false);
      }
    };

    loadAssets();
  }, [currentApiKeyData?.api_key, accountType]);

  // Transform data when assets or prices change
  useEffect(() => {
    if (assetsData.length > 0) {
      const transformedData = transformAssetData(assetsData, getUsdPrice);
      setData(transformedData);
    }
  }, [assetsData, getUsdPrice]);

  return {
    data,
    loading: loading || pricesLoading,
    error,
  };
}
