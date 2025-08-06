import { useState, useEffect } from 'react';
import { Fetcher as _Fetcher } from '../fetcher';
import { ApiPath as _ApiPath } from './api-path';
import { useCurrentApiKey } from '@/lib/hooks/use-current-api-key';

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
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockData: AssetsResponse = {
    code: 200,
    msg: "success",
    data: {
      account_type: "funding",
      assets: [
        {
          symbol: "BTC",
          total: 0.298,
          available: 0.298,
          frozen: 0
        },
        {
          symbol: "USDT",
          total: 11730,
          available: 11730,
          frozen: 0
        }
      ]
    }
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
 * @returns Transformed data for table display
 */
function transformAssetData(assets: AssetItem[]): AssetTableData[] {
  return assets.map((asset, index) => ({
    id: `${asset.symbol}-${index}`,
    coin: asset.symbol,
    netAssetValue: asset.total.toFixed(8),
    netAssetValueUsd: `≈${(asset.total * (asset.symbol === 'BTC' ? 118575.90 : 1)).toFixed(2)} USD`,
    balance: asset.available.toFixed(8),
    sportCost: '--',
    lastPrice: asset.symbol === 'BTC' ? '118575.90 USD' : '1.00 USD',
    pnl: '--'
  }));
}

/**
 * Hook to fetch and manage assets data
 * @param accountType - Account type filter
 * @returns Object containing assets data, loading state, and error state
 */
export function useAssets(accountType: string = 'unified') {
  const [data, setData] = useState<AssetTableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { data: currentApiKeyData } = useCurrentApiKey();
  
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
        const transformedData = transformAssetData(response.data.assets);
        setData(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load assets');
      } finally {
        setLoading(false);
      }
    };
    
    loadAssets();
  }, [currentApiKeyData?.api_key, accountType]);
  
  return { data, loading, error };
}