import { useQuery } from '@tanstack/react-query';

import { Fetcher } from '@/lib/fetcher';
import { useAppStore } from '@/lib/store';
import { TokenPair } from '@/lib/types/asset';

import { ApiPath } from './api-path';

export function useTokenPairs() {
  const { user } = useAppStore();

  const query = useQuery({
    queryKey: ['token-pairs'],
    queryFn: async (): Promise<TokenPair[]> => {
      if (!user.token || !user.user_id) {
        throw new Error('user not logged in');
      }

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
    // 缓存配置优化
    staleTime: 5 * 60 * 1000, // 5分钟内数据被认为是新鲜的
    gcTime: 10 * 60 * 1000, // 10分钟内数据保留在缓存中
    refetchOnWindowFocus: false, // 窗口聚焦时不重新请求
    refetchOnMount: false, // 组件挂载时不重新请求（如果缓存中有数据）
    refetchOnReconnect: false, // 网络重连时不重新请求
  });

  return query;
}
