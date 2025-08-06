'use client';

import { useParams } from 'next/navigation';

import { ApiKeysBar } from './api-keys-bar';
import { ChartContainer } from './chart-container';
import { TableContainer } from './table-container';
import { TradePanel } from './trade-panel';

export default function OrdersPage() {
  const params = useParams();
  const tokenPair = params['token-pair'] as string[];

  const [baseCoin, quoteCoin] = tokenPair;

  return (
    <div className="flex flex-col flex-1 bg-ui-bg-field overflow-auto">
      <ApiKeysBar />
      <div className="p-4 flex gap-x-4 flex-1 overflow-auto">
        <div className="part-1 flex flex-col flex-1 overflow-auto">
          <ChartContainer />
          <TableContainer />
        </div>
        <TradePanel baseCoin={baseCoin} quoteCoin={quoteCoin} />
      </div>
    </div>
  );
}
