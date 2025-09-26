'use client';

import { redirect } from 'next/navigation';

import { useCurrentApiKey } from '@/lib/hooks/use-current-api-key';

export default function Home() {
  const { data: currentApiKeyObj } = useCurrentApiKey();

  if (currentApiKeyObj) {
    redirect(`/${currentApiKeyObj.platform}`);
  }

  return <></>;
}
