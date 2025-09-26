'use client';

import { useApiKeyUrl } from '@/lib/hooks/use-api-key-url';

import { ChartContainer } from './chart-container';
import { TableContainer } from './table-container';
import { TradePanel } from './trade-panel';

export default function OrdersPage() {
  const { baseCoin, quoteCoin } = useApiKeyUrl();

  return (
    <div className="p-4 flex gap-x-4 flex-1 overflow-auto">
      <div className="part-1 flex flex-col flex-1 overflow-auto">
        <ChartContainer />
        <TableContainer baseCoin={baseCoin} quoteCoin={quoteCoin} />
      </div>
      <TradePanel baseCoin={baseCoin} quoteCoin={quoteCoin} />
    </div>
  );
}
