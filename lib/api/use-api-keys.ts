import { useQuery } from '@tanstack/react-query';

import { useEffect, useRef } from 'react';

import { Fetcher } from '@/lib/fetcher';
import { useAppStore } from '@/lib/store';
import { ApiKey } from '@/lib/types/api-key';

import { ApiPath } from './api-path';

export function useApiKeys() {
  const { user, currentApiKeyId, setCurrentApiKeyId } = useAppStore();
  const processedDataRef = useRef<string | null>(null);

  const query = useQuery({
    queryKey: ['api-keys'],
    queryFn: async (): Promise<ApiKey[]> => {
      if (!user.token || !user.user_id) {
        throw new Error('用户未登录');
      }

      // TODO: remove this
      return [
        {
          id: '8dca6d18-62d7-426b-9b39-96534a177c3d',
          platform: 'bybit',
          account_name: 'bybit_1',
          api_key: 'hpQVBVCgZnFYUEPH7U',
          description: "Danny's bybit api key",
          created_at: '2025-07-29T09:29:42.409983Z',
        },
      ];

      return Fetcher<ApiKey[]>(ApiPath.apiKeys, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
          'X-User-ID': user.user_id,
        },
      });
    },
    enabled: !!user.token && !!user.user_id,
  });

  useEffect(() => {
    if (query.data && query.data.length > 0) {
      const dataKey = JSON.stringify(query.data.map((key) => key.id).sort());

      if (processedDataRef.current !== dataKey) {
        processedDataRef.current = dataKey;

        const apiKeyExists = query.data.some((apiKey) => apiKey.id === currentApiKeyId);

        if (!apiKeyExists) {
          setCurrentApiKeyId(query.data[0].id);
        }
      }
    }
  }, [query.data, setCurrentApiKeyId, currentApiKeyId]);

  return query;
}
