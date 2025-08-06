import { useQuery } from '@tanstack/react-query';

import { ApiPath } from '@/lib/api/api-path';
import { Fetcher } from '@/lib/fetcher';
import { useCurrentApiKey } from '@/lib/hooks/use-current-api-key';
import { useAppStore } from '@/lib/store';
import { TokenPair } from '@/lib/types/asset';

export function useCurrentTokenPair() {
  const { user } = useAppStore();
  const { data: currentApiKey } = useCurrentApiKey();

  const query = useQuery({
    queryKey: ['current-token-pair', currentApiKey?.api_key],
    queryFn: async (): Promise<TokenPair> => {
      if (!user.token || !user.user_id) {
        throw new Error('user not logged in');
      }

      if (!currentApiKey?.api_key) {
        throw new Error('no api key selected');
      }

      return Fetcher<TokenPair>(`${ApiPath.currentSymbol}?api_key=${currentApiKey?.api_key}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
          'X-User-ID': user.user_id || '',
        },
      });
    },

    enabled: !!user.token && !!user.user_id && !!currentApiKey?.api_key,
  });

  return query;
}
