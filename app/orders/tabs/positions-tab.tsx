'use client';

import { Table } from '@medusajs/ui';

/**
 * PositionsTab component displays positions table
 * Matches the design with columns: Contracts, Qty, Value, Entry, Mark Price, Liq. Price, IM, MM, Close By
 */
export function PositionsTab() {
  // Sample data matching the design
  const positions = [
    {
      contracts: 'BTCUSDT',
      crossPercent: 'Cross 10.00x',
      qty: '686 BTC',
      value: '199,917.78 USDT',
      entry: '118,575.20',
      markPrice: '113,539.60',
      liqPrice: '61,099.29',
      im: '20,090.7380 USDT ≈20,090.73 USD',
      mm: '1,098.5482 USDT ≈1,098.54 USD',
      closeBy: 'Limit Market'
    }
  ];

  return (
    <div className="w-full h-full">
      <Table>
        <Table.Header className="bg-ui-bg-subtle">
          <Table.Row className="border-b border-ui-border-base">
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              Contracts
            </Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              Qty
            </Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              Value
            </Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              Entry
            </Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              Mark Price
            </Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              Liq. Price
            </Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              IM
            </Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              MM
            </Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              Close By
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {positions.map((position, index) => (
            <Table.Row key={index} className="border-b border-ui-border-base hover:bg-ui-bg-subtle-hover">
              <Table.Cell className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="smm-text text-ui-fg-base">{position.contracts}</span>
                  <span className="text-xs text-ui-green">{position.crossPercent}</span>
                </div>
              </Table.Cell>
              <Table.Cell className="px-4 py-3 smm-text text-ui-fg-base">
                {position.qty}
              </Table.Cell>
              <Table.Cell className="px-4 py-3 smm-text text-ui-fg-base">
                {position.value}
              </Table.Cell>
              <Table.Cell className="px-4 py-3 smm-text text-ui-fg-base">
                {position.entry}
              </Table.Cell>
              <Table.Cell className="px-4 py-3 smm-text text-ui-fg-base">
                {position.markPrice}
              </Table.Cell>
              <Table.Cell className="px-4 py-3 smm-text text-orange-500">
                {position.liqPrice}
              </Table.Cell>
              <Table.Cell className="px-4 py-3 smm-text text-ui-fg-base">
                {position.im}
              </Table.Cell>
              <Table.Cell className="px-4 py-3 smm-text text-ui-fg-base">
                {position.mm}
              </Table.Cell>
              <Table.Cell className="px-4 py-3">
                <div className="flex gap-2">
                  <button className="smm-text text-ui-fg-muted hover:text-ui-fg-base transition-colors">
                    Limit
                  </button>
                  <button className="smm-text text-ui-fg-muted hover:text-ui-fg-base transition-colors">
                    Market
                  </button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}