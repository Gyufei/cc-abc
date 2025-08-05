import { useAppStore } from '@/lib/store';

import { useApiKeys } from './use-api-keys';

export function useCurrentApiKey() {
  const res = useApiKeys();
  const { currentApiKeyId } = useAppStore();

  return {
    ...res,
    data: res.data?.find((key) => key.id === currentApiKeyId),
  };
}
