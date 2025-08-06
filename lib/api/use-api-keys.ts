import { useQuery } from '@tanstack/react-query';

import { useEffect, useRef } from 'react';

import { Fetcher } from '@/lib/fetcher';
import { useAppStore } from '@/lib/store';
import { ApiKey } from '@/lib/types/common';

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

      return Fetcher<ApiKey[]>(ApiPath.apiKeys, {
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
