import { useQuery } from '@tanstack/react-query';

import { ApiPath } from '@/lib/api/api-path';
import { Fetcher } from '@/lib/fetcher';
import { MarketInfo } from '@/lib/types/common';

export function getMarketInfoData(baseCoin: string, quoteCoin: string) {
  const symbol = `${baseCoin}${quoteCoin}`;

  if (!symbol) {
    return;
  }

  return Fetcher<MarketInfo>(`${ApiPath.tradingMarket}?symbol=${symbol}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function useMarketInfo(baseCoin: string, quoteCoin: string) {
  const query = useQuery({
    queryKey: ['market-info', baseCoin, quoteCoin],
    queryFn: async (): Promise<MarketInfo | undefined> => {
      if (!baseCoin || !quoteCoin) {
        return;
      }

      const symbol = `${baseCoin}${quoteCoin}`;

      return Fetcher<MarketInfo>(`${ApiPath.tradingMarket}?symbol=${symbol}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
  });

  return query;
}
