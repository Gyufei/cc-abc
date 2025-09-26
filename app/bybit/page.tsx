'use client';

import { useEffect } from 'react';

import { redirect } from 'next/navigation';

export default function OrdersPage() {
  const tokenPair = {
    base_asset: 'BTC',
    quote_asset: 'USDT',
  };
  const baseCoin = tokenPair?.base_asset;
  const quoteCoin = tokenPair?.quote_asset;

  useEffect(() => {
    if (baseCoin && quoteCoin) {
      redirect(`/bybit/${baseCoin}/${quoteCoin}`);
    }
  }, [baseCoin, quoteCoin]);

  return <></>;
}
