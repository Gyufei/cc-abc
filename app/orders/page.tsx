'use client';

import { useCurrentTokenPair } from '@/lib/api/use-current-token-pair';

import { ApiKeysBar } from './api-keys-bar';
import { ChartContainer } from './chart-container';
import { TableContainer } from './table-container';
import { TradePanel } from './trade-panel';

export default function OrdersPage() {
  const { data: tokenPair, isLoading: isLoadingTokenPair } = useCurrentTokenPair();
  const baseCoin = tokenPair?.base_asset;
  const quoteCoin = tokenPair?.quote_asset;

  return (
    <div className="flex flex-col flex-1 bg-ui-bg-field overflow-auto">
      <ApiKeysBar />
      <div className="p-4 flex gap-x-4 flex-1 overflow-auto">
        <div className="part-1 flex flex-col flex-1 overflow-auto">
          <ChartContainer />
          {tokenPair && <TableContainer tokenPair={tokenPair} />}
        </div>
        {isLoadingTokenPair || !baseCoin || !quoteCoin ? (
          <div
            className="w-[320px] border border-ui-border-base flex items-center justify-center rounded-lg h-[600px]"
            style={{
              boxShadow: 'inset 0px 0px 0px 2px #FFFFFF',
            }}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ui-border-base"></div>
          </div>
        ) : (
          <TradePanel baseCoin={baseCoin} quoteCoin={quoteCoin} />
        )}
      </div>
    </div>
  );
}
