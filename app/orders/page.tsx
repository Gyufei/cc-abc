'use client';

import { useState } from 'react';

import { ApiKeysBar } from './api-keys-bar';
import { ChartContainer } from './chart-container';
import { TableContainer } from './table-container';
import { TradePanel } from './trade-panel';

export default function OrdersPage() {
  const [token0, setToken0] = useState<string | null>(null);
  const [token1, setToken1] = useState<string | null>(null);

  function setToken(token0: string, token1: string) {
    setToken0(token0);
    setToken1(token1);
  }

  return (
    <div className="flex flex-col flex-1 bg-ui-bg-field overflow-auto">
      <ApiKeysBar />
      <div className="p-4 flex gap-x-4 flex-1 ">
        <div className="part-1 flex flex-col flex-1  overflow-auto">
          <ChartContainer token0={token0} token1={token1} setToken={setToken} />
          <TableContainer />
        </div>
        <TradePanel token0={token0} token1={token1} />
      </div>
    </div>
  );
}
