import { useQuery } from '@tanstack/react-query';

import { ApiPath } from '@/lib/api/api-path';
import { Fetcher } from '@/lib/fetcher';
import { useCurrentApiKey } from '@/lib/hooks/use-current-api-key';
import { useAppStore } from '@/lib/store';
import { AccountAssets } from '@/lib/types/asset';

export function useAccountAssets(accountType: string = 'unified') {
  const { user } = useAppStore();
  const { data: currentApiKey } = useCurrentApiKey();

  const query = useQuery({
    queryKey: ['account-assets', accountType, currentApiKey?.api_key],
    queryFn: async (): Promise<AccountAssets> => {
      if (!user.token || !user.user_id) {
        throw new Error('user not logged in');
      }

      if (!currentApiKey?.api_key) {
        throw new Error('no api key selected');
      }

      return Fetcher<AccountAssets>(
        `${ApiPath.tradingAssets}?account_type=unified&api_key=${currentApiKey?.api_key}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
            'X-User-ID': user.user_id || '',
          },
        }
      );
    },

    enabled: !!user.token && !!user.user_id && !!currentApiKey?.api_key,
  });

  return query;
}
