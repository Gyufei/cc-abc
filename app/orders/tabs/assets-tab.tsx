'use client';

import { Table } from '@medusajs/ui';

/**
 * AssetsTab component displays assets table
 * Matches the design with columns: Coins, Net Asset Aalue, Balance, Sport Cost, Last Price, PnL
 */
export function AssetsTab() {
  // Sample data matching the design
  const assets = [
    {
      coin: 'BTC',
      netAssetValue: '0.00000000',
      netAssetValueUsd: '≈0.00 USD',
      balance: '0.00000000',
      sportCost: '--',
      lastPrice: '118575.90 USD',
      pnl: '--'
    }
  ];

  return (
    <div className="w-full h-full">
      <Table>
        <Table.Header className="bg-ui-bg-subtle">
          <Table.Row className="border-b border-ui-border-base">
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs">₿</span>
                Coins
              </div>
            </Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              Net Asset Aalue
            </Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              Balance
            </Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              Sport Cost
            </Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              Last Price
            </Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              PnL
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {assets.map((asset, index) => (
            <Table.Row key={index} className="border-b border-ui-border-base hover:bg-ui-bg-subtle-hover">
              <Table.Cell className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-white"></span>
                  </div>
                  <span className="smm-text text-ui-fg-base font-medium">{asset.coin}</span>
                </div>
              </Table.Cell>
              <Table.Cell className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="smm-text text-ui-fg-base">{asset.netAssetValue}</span>
                  <span className="text-xs text-ui-fg-muted">{asset.netAssetValueUsd}</span>
                </div>
              </Table.Cell>
              <Table.Cell className="px-4 py-3 smm-text text-ui-fg-base">
                {asset.balance}
              </Table.Cell>
              <Table.Cell className="px-4 py-3 smm-text text-ui-fg-base">
                {asset.sportCost}
              </Table.Cell>
              <Table.Cell className="px-4 py-3 smm-text text-ui-fg-base">
                {asset.lastPrice}
              </Table.Cell>
              <Table.Cell className="px-4 py-3 smm-text text-ui-fg-base">
                {asset.pnl}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}