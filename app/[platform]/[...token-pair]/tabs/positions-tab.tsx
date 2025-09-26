'use client';

import { Table } from '@medusajs/ui';

// Type definition for position data
interface PositionData {
  id: string;
  contracts: string;
  crossPercent: string;
  qty: string;
  value: string;
  entry: string;
  markPrice: string;
  liqPrice: string;
  im: string;
  mm: string;
  closeBy: string;
}

/**
 * PositionsTab component displays positions table
 * Uses @medusajs/ui Table component with sticky first and last columns
 */
export function PositionsTab() {
  // Sample data matching the design
  const positionsData: PositionData[] = [
    {
      id: '1',
      contracts: 'BTCUSDT',
      crossPercent: 'Cross 10.00x',
      qty: '686 BTC',
      value: '199,917.78 USDT',
      entry: '118,575.20',
      markPrice: '113,539.60',
      liqPrice: '61,099.29',
      im: '20,090.7380 USDT ≈20,090.73 USD',
      mm: '1,098.5482 USDT ≈1,098.54 USD',
      closeBy: 'Limit Market',
    },
  ];

  return (
    <div className="w-full h-full overflow-x-auto">
      <div style={{ minWidth: '1200px' }}>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="sticky left-0 z-10 bg-ui-bg-subtle border-r border-ui-border-base sticky-left-header-shadow whitespace-nowrap pl-3">
                Contracts
              </Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">Qty</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">Value</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">Entry</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">Mark Price</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">Liq. Price</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">IM</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">MM</Table.HeaderCell>
              <Table.HeaderCell className="sticky right-0 z-10 bg-ui-bg-subtle border-l border-ui-border-base sticky-right-header-shadow whitespace-nowrap pl-3">
                Close By
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {positionsData.map((item: PositionData) => (
              <Table.Row key={item.id}>
                <Table.Cell className="sticky left-0 z-10 bg-ui-bg-base border-r border-ui-border-base sticky-left-shadow whitespace-nowrap pl-3">
                  <div className="flex flex-col">
                    <span className="text-ui-fg-base">{item.contracts}</span>
                    <span className="text-xs text-green-600">{item.crossPercent}</span>
                  </div>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">{item.qty}</Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">{item.value}</Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">{item.entry}</Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">{item.markPrice}</Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">
                  <span className="text-orange-500">{item.liqPrice}</span>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">{item.im}</Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">{item.mm}</Table.Cell>
                <Table.Cell className="sticky right-0 z-10 bg-ui-bg-base border-l border-ui-border-base sticky-right-shadow whitespace-nowrap pl-3">
                  <div className="flex gap-2">
                    <button className="text-sm text-ui-fg-muted hover:text-ui-fg-base transition-colors border border-ui-border-base px-2 py-1 rounded">
                      Limit
                    </button>
                    <button className="text-sm text-ui-fg-muted hover:text-ui-fg-base transition-colors border border-ui-border-base px-2 py-1 rounded">
                      Market
                    </button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
