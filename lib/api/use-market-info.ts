import { useQuery } from '@tanstack/react-query';

import { ApiPath } from '@/lib/api/api-path';
import { Fetcher } from '@/lib/fetcher';
import { MarketInfo } from '@/lib/types/common';

export function useMarketInfo(symbol: string) {
  const query = useQuery({
    queryKey: ['market-info', symbol],
    queryFn: async (): Promise<MarketInfo> => {
      if (!symbol) {
        throw new Error('symbol is required');
      }

      // TODO: remove this mock data
      return {
        symbol: 'BTCUSDT',
        price: 117694.43,
        change_24h: 2.34,
        volume_24h: 64.037123,
        high_24h: 130883.99,
        low_24h: 105814.62,
      };

      // TODO: uncomment when API is ready
      return Fetcher<MarketInfo>(`${ApiPath.tradingMarket}?symbol=${symbol}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${user.token}`,
          // 'X-User-ID': user.user_id || '',
        },
      });
    },
  });

  return query;
}
