'use client';

import { useEffect } from 'react';

import { redirect } from 'next/navigation';

import { useCurrentTokenPair } from '@/lib/api/use-current-token-pair';

export default function OrdersPage() {
  const { data: tokenPair } = useCurrentTokenPair();
  const baseCoin = tokenPair?.base_asset;
  const quoteCoin = tokenPair?.quote_asset;

  useEffect(() => {
    if (baseCoin && quoteCoin) {
      redirect(`/bybit/${baseCoin}/${quoteCoin}`);
    }
  }, [baseCoin, quoteCoin]);

  return <></>;
}
