'use client';

import { Select } from '@medusajs/ui';

import { useEffect } from 'react';

import { useTokenPairs } from '@/lib/api/use-token-pairs';

interface ChartContainerProps {
  token0: string | null;
  token1: string | null;
  setToken: (token0: string, token1: string) => void;
}

export function TokenPairSelector({ token0, token1, setToken }: ChartContainerProps) {
  const { data: tokenPairs = [], isLoading } = useTokenPairs();

  const selectedPair = `${token0}/${token1}`;

  useEffect(() => {
    if (tokenPairs.length > 0 && !token0 && !token1) {
      const defaultTokenPair = tokenPairs[0];
      const [token0, token1] = defaultTokenPair.display_name.split('/');
      setToken(token0, token1);
    }
  }, [tokenPairs, setToken, token0, token1]);

  return (
    <div className="mb-4">
      <label className="text-sm font-medium text-ui-fg-base mb-2 block">选择交易对</label>
      <Select
        value={selectedPair || ''}
        onValueChange={(value) => {
          const [token0, token1] = value.split('/');
          setToken(token0, token1);
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
