import { useApiKeys } from '@/lib/api/use-api-keys';
import { useAppStore } from '@/lib/store';

export function useCurrentApiKey() {
  const res = useApiKeys();
  const { currentApiKeyId } = useAppStore();

  return {
    ...res,
    data: res.data?.find((key) => key.id === currentApiKeyId),
  };
}
