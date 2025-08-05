'use client';

import { TokenPairSelector } from './token-pair-selector';

export function ChartContainer({
  token0,
  token1,
  setToken,
}: {
  token0: string | null;
  token1: string | null;
  setToken: (token0: string, token1: string) => void;
}) {
  return (
    <div className="flex-1">
      <TokenPairSelector token0={token0} token1={token1} setToken={setToken} />
    </div>
  );
}
