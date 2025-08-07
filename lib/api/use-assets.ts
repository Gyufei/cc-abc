import { useQuery } from '@tanstack/react-query';

import { ApiPath, isProduction } from '@/lib/api/api-path';
import { Fetcher } from '@/lib/fetcher';
import { useCurrentApiKey } from '@/lib/hooks/use-current-api-key';
import { useAppStore } from '@/lib/store';

import { getTokensPrice } from './get-tokens-price';

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
 * @param btcPrice - BTC market price from useMarketInfo
 * @param ethPrice - ETH market price from useMarketInfo
 * @returns Transformed data for table display
 */
function transformAssetData(
  assets: AssetItem[],
  priceMap: Record<string, number>
): AssetTableData[] {
  return assets.map((asset, index) => {
    // Use market price from useMarketInfo based on asset symbol
    const tokenPrice = priceMap[asset.symbol] || 1; // Default for USDT
    const netAssetValueUsd = asset.total * tokenPrice;

    return {
      id: `${asset.symbol}-${index}`,
      coin: asset.symbol,
      netAssetValue: asset.total.toFixed(8),
      netAssetValueUsd: `≈${netAssetValueUsd.toFixed(2)} USD`,
      balance: asset.available.toFixed(8),
      sportCost: '--',
      lastPrice: asset.symbol === 'USDT' ? '--' : `${tokenPrice.toFixed(2)} USD`,
      pnl: '--',
    };
  });
}

export function useAssets() {
  const { user } = useAppStore();
  const { data: currentApiKey } = useCurrentApiKey();

  const query = useQuery({
    queryKey: ['table-assets', currentApiKey?.api_key],
    queryFn: async (): Promise<AssetTableData[]> => {
      if (!user.token || !user.user_id) {
        throw new Error('user not logged in');
      }

      if (!currentApiKey?.api_key) {
        throw new Error('no api key selected');
      }

      const symbols = isProduction
        ? ([
            ['BTC', 'USDT'],
            ['ETH', 'USDT'],
            ['MAK', 'USDT'],
            ['MIA', 'USDT'],
          ] as [string, string][])
        : ([
            ['BTC', 'USDT'],
            ['ETH', 'USDT'],
          ] as [string, string][]);

      const priceMap = await getTokensPrice(symbols);
      console.log('🚀 ~ queryFn: ~ priceMap:', priceMap);

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

      return transformAssetData(response.assets, priceMap);
    },

    enabled: !!user.token && !!user.user_id && !!currentApiKey?.api_key,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });

  return query;
}
