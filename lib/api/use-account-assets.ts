import { useQuery } from '@tanstack/react-query';

import { ApiPath } from '@/lib/api/api-path';
import { Fetcher } from '@/lib/fetcher';
import { useCurrentApiKey } from '@/lib/hooks/use-current-api-key';
import { useAppStore } from '@/lib/store';
import { AccountAssets } from '@/lib/types/asset';

export function useAccountAssets(accountType: string = 'unified') {
  const { user, currentApiKeyId } = useAppStore();
  const { data: currentApiKey } = useCurrentApiKey();

  const query = useQuery({
    queryKey: ['account-assets', currentApiKeyId, accountType],
    queryFn: async (): Promise<AccountAssets> => {
      if (!user.token || !user.user_id) {
        throw new Error('user not logged in');
      }

      if (!currentApiKeyId) {
        throw new Error('no api key selected');
      }

      // TODO: remove this mock data
      return {
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
      };

      // TODO: uncomment when API is ready
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

    enabled: !!user.token && !!user.user_id && !!currentApiKeyId,
  });

  return query;
}
