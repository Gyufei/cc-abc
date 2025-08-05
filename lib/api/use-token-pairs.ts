import { useQuery } from '@tanstack/react-query';

import { Fetcher } from '@/lib/fetcher';
import { useAppStore } from '@/lib/store';
import { TokenPair } from '@/lib/types/trade';

import { ApiPath } from './api-path';

export function useTokenPairs() {
  const { user } = useAppStore();

  const query = useQuery({
    queryKey: ['token-pairs'],
    queryFn: async (): Promise<TokenPair[]> => {
      if (!user.token || !user.user_id) {
        throw new Error('用户未登录');
      }

      // TODO: remove this
      return [
        {
          symbol: 'BTCUSDT',
          display_name: 'BTC/USDT',
        },
        {
          symbol: 'ETHUSDT',
          display_name: 'ETH/USDT',
        },
      ];

      return Fetcher<TokenPair[]>(ApiPath.tradingSymbols, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
          'X-User-ID': user.user_id || '',
        },
      });
    },
    enabled: !!user.token && !!user.user_id,
  });

  return query;
} 