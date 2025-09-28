'use client';

import { Button } from '@medusajs/ui';

import { useParams, useRouter } from 'next/navigation';

import { useApiKeys } from '@/lib/api/use-api-keys';

import { ApiKeysBar } from './[...token-pair]/api-keys-bar';

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const { platform } = useParams();
  const { isLoading, data: apiKeys } = useApiKeys();
  const router = useRouter();

  if (isLoading) {
    return <></>;
  }

  if (!apiKeys?.length || !apiKeys.some((key) => key.platform === platform)) {
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
