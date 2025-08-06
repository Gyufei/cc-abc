'use client';

import { useState } from 'react';

import { ApiKeysBar } from './api-keys-bar';
import { ChartContainer } from './chart-container';
import { TableContainer } from './table-container';
import { TradePanel } from './trade-panel';

export default function OrdersPage() {
  const [baseCoin, setBaseCoin] = useState<string | null>(null);
  const [quoteCoin, setQuoteCoin] = useState<string | null>(null);

  function setToken(bCoin: string, qCoin: string) {
    setBaseCoin(bCoin);
    setQuoteCoin(qCoin);
  }

  return (
    <div className="flex flex-col flex-1 bg-ui-bg-field">
      <ApiKeysBar />
      <div className="p-4 flex gap-x-4 flex-1 ">
        <div className="part-1 flex flex-col flex-1">
          <ChartContainer baseCoin={baseCoin} quoteCoin={quoteCoin} onTokenChange={setToken} />
          <TableContainer />
        </div>
        <TradePanel baseCoin={baseCoin} quoteCoin={quoteCoin} />
      </div>
    </div>
  );
}
