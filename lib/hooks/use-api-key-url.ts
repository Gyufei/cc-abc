import { redirect, useParams } from 'next/navigation';

import { useCurrentApiKey } from './use-current-api-key';

export function useApiKeyUrl() {
  const params = useParams();
  const platform = params['platform'] as string;
  const tokenPair = params['token-pair'] as string[];
  const { data: currentApiKeyObj } = useCurrentApiKey();

  const [baseCoin, quoteCoin] = tokenPair;

  if (currentApiKeyObj && currentApiKeyObj?.platform !== platform) {
    if (baseCoin && quoteCoin) {
      redirect(`/${currentApiKeyObj?.platform}/${baseCoin}/${quoteCoin}`);
    } else {
      redirect(`/${currentApiKeyObj?.platform}`);
    }
  }

  return {
    platform,
    baseCoin,
    quoteCoin,
  };
}
