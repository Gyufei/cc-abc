'use client';

import { Button } from '@medusajs/ui';

import { useParams, useRouter } from 'next/navigation';

import { useApiKeys } from '@/lib/api/use-api-keys';
import { useTokenPairs } from '@/lib/api/use-token-pairs';

import { ApiKeysBar } from './[...token-pair]/api-keys-bar';

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const { platform, 'token-pair': tokenPair } = useParams();
  const { isLoading, data: apiKeys } = useApiKeys();
  const router = useRouter();

  const { data: tokenPairs } = useTokenPairs();
  const isTokenPairValid =
    tokenPair && tokenPairs?.length
      ? tokenPairs?.some((pair) => pair.symbol === `${tokenPair[0]}${tokenPair[1]}`)
      : false;

  if (isLoading) {
    return <div className="h-full flex items-center justify-center"></div>;
  }

  if (!apiKeys?.length) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-y-4">No API Keys</div>
    );
  }

  if (
    !apiKeys.some((key) => key.platform === platform) ||
    (tokenPair && tokenPairs?.length && !isTokenPairValid)
  ) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-y-4">
        <div className="text-ui-text-base">404</div>
        <Button onClick={() => router.push('/')}>Go to Home</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-ui-bg-field overflow-auto h-full">
      <ApiKeysBar />
      {children}
    </div>
  );
}
