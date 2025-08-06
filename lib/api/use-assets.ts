import { useQuery } from '@tanstack/react-query';

import { ApiPath } from '@/lib/api/api-path';
import { Fetcher } from '@/lib/fetcher';
import { useCurrentApiKey } from '@/lib/hooks/use-current-api-key';
import { useAppStore } from '@/lib/store';
import { useMarketPrices } from './use-market-prices';

// Interface for asset item from API
export interface AssetItem {
  symbol: string;
  total: number;
  available: number;
  frozen: number;
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
 * Transform API data to table display format
 * @param assets - Raw asset data from API
 * @returns Transformed data for table display
 */
function transformAssetData(
  assets: AssetItem[],
  getUsdPrice?: (symbol: string) => number
): AssetTableData[] {
  return assets.map((asset, index) => {
    const usdPrice = getUsdPrice?.(asset.symbol) || 113995;
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

export function useAssets() {
  const { user } = useAppStore();
  const { data: currentApiKey } = useCurrentApiKey();
   // Use real-time price service
  const { getUsdPrice } = useMarketPrices(
    ['BTCUSDT'],
    5000 // Update every 5 seconds
  );


  const query = useQuery({
    queryKey: ['table-assets', currentApiKey?.api_key],
    queryFn: async (): Promise<AssetTableData[]> => {
      if (!user.token || !user.user_id) {
        throw new Error('user not logged in');
      }

      if (!currentApiKey?.api_key) {
        throw new Error('no api key selected');
      }

      const params = new URLSearchParams({
        api_key: currentApiKey.api_key,
        account_type: 'unified',
      });

      const url = `${ApiPath.tradingAssets}?${params.toString()}`;

      const response = await Fetcher<{ account_type: string; assets: AssetItem[] }>(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
          'X-User-ID': user.user_id || '',
        },
      });

      return transformAssetData(response.assets, getUsdPrice);
    },

    enabled: !!user.token && !!user.user_id && !!currentApiKey?.api_key,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });

  return query;
}
