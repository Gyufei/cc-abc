import { useEffect } from 'react';

import { redirect, useParams } from 'next/navigation';

import { useApiKeys } from '../api/use-api-keys';
import { useAppStore } from '../store';
import { useCurrentApiKey } from './use-current-api-key';

export function useApiKeyUrl() {
  const params = useParams();
  const { data: apiKeys } = useApiKeys();
  const platform = params['platform'] as string;
  const tokenPair = params['token-pair'] as string[];
  const { data: currentApiKeyObj } = useCurrentApiKey();
  const { setCurrentApiKeyId } = useAppStore();
  const [baseCoin, quoteCoin] = tokenPair;

  useEffect(() => {
    if (!apiKeys) {
      return;
    }

    const platformApiKey = apiKeys?.find((key) => key.platform === platform);

    if (!platform && currentApiKeyObj) {
      if (baseCoin && quoteCoin) {
        redirect(`/${currentApiKeyObj?.platform}/${baseCoin}/${quoteCoin}`);
      } else {
        redirect(`/${currentApiKeyObj?.platform}`);
      }
    }

    if (platform && platformApiKey && currentApiKeyObj?.platform !== platform) {
      setCurrentApiKeyId(platformApiKey.id);
    }
  }, [apiKeys, platform, currentApiKeyObj, setCurrentApiKeyId, baseCoin, quoteCoin]);

  return {
    platform,
    baseCoin,
    quoteCoin,
  };
}
