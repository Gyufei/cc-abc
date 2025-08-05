import { useMemo } from 'react';

import { useAccountAssets } from '../api/use-account-assets';

export function useTokenBalance(token: string | null) {
  const res = useAccountAssets();

  const assets = res.data?.assets;

  const balance = useMemo(() => {
    if (!assets) {
      return '0';
    }

    const asset = assets.find((asset) => asset.symbol === token);
    return asset?.available || '0';
  }, [assets, token]);

  return {
    ...res,
    data: balance,
  };
}
