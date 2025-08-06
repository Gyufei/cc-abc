'use client';

import { TokenPairSelector } from './token-pair-selector';

export function ChartContainer({
  baseCoin,
  quoteCoin,
  onTokenChange,
}: {
  baseCoin: string | null;
  quoteCoin: string | null;
  onTokenChange: (bCoin: string, qCoin: string) => void;
}) {
  return (
    <div className="flex-1">
      <TokenPairSelector baseCoin={baseCoin} quoteCoin={quoteCoin} onTokenChange={onTokenChange} />
    </div>
  );
}
