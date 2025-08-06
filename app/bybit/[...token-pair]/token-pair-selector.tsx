'use client';

import { Select } from '@medusajs/ui';

import { useEffect } from 'react';

import { useTokenPairs } from '@/lib/api/use-token-pairs';

interface ChartContainerProps {
  baseCoin: string | null;
  quoteCoin: string | null;
  onTokenChange: (bCoin: string, qCoin: string) => void;
}

export function TokenPairSelector({ baseCoin, quoteCoin, onTokenChange }: ChartContainerProps) {
  const { data: tokenPairs = [], isLoading } = useTokenPairs();

  const selectedPair = `${baseCoin}/${quoteCoin}`;

  useEffect(() => {
    if (tokenPairs.length > 0 && !baseCoin && !quoteCoin) {
      const defaultTokenPair = tokenPairs[0];
      const [bCoin, qCoin] = defaultTokenPair.display_name.split('/');
      onTokenChange(bCoin, qCoin);
    }
  }, [tokenPairs, onTokenChange, baseCoin, quoteCoin]);

  return (
    <div className="mb-4">
      <label className="text-sm font-medium text-ui-fg-base mb-2 block">选择交易对</label>
      <Select
        value={selectedPair || ''}
        onValueChange={(value) => {
          const [bCoin, qCoin] = value.split('/');
          onTokenChange(bCoin, qCoin);
        }}
        disabled={isLoading}
      >
        <Select.Trigger>
          <Select.Value placeholder="选择交易对" />
        </Select.Trigger>
        <Select.Content>
          {tokenPairs.map((token) => (
            <Select.Item key={token.symbol} value={token.display_name}>
              {token.display_name}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  );
}
