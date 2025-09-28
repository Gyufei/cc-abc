'use client';

import { redirect, useParams } from 'next/navigation';

import { useApiKeys } from '@/lib/api/use-api-keys';

export default function OrdersPage() {
  const { data: apiKeys, isLoading } = useApiKeys();
  const { platform } = useParams();

  const tokenPair = {
    base_asset: 'BTC',
    quote_asset: 'USDT',
  };
  const baseCoin = tokenPair?.base_asset;
  const quoteCoin = tokenPair?.quote_asset;

  if (isLoading || !apiKeys?.some((key) => key.platform === platform)) {
    return <></>;
  }

  redirect(`/${platform}/${baseCoin}/${quoteCoin}`);
}
