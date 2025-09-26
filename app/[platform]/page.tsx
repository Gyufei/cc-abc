'use client';

import { redirect, useParams } from 'next/navigation';

export default function OrdersPage() {
  const { platform } = useParams();

  const tokenPair = {
    base_asset: 'BTC',
    quote_asset: 'USDT',
  };
  const baseCoin = tokenPair?.base_asset;
  const quoteCoin = tokenPair?.quote_asset;

  redirect(`/${platform}/${baseCoin}/${quoteCoin}`);
}
