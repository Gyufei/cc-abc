'use client';

import { Table } from '@medusajs/ui';
import { useAssets, AssetTableData } from '@/lib/api/use-assets';
import { useCurrentApiKey } from '@/lib/hooks/use-current-api-key';

/**
 * AssetsTab component displays assets table
 * Uses @medusajs/ui Table component with sticky first and last columns
 */
export function AssetsTab() {
  // Get current API key data
  const { data: currentApiKeyData } = useCurrentApiKey();
  
  // Get assets data with loading and error states
  const { data: assetsData, loading, error } = useAssets('unified');
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-ui-fg-muted">Loading assets...</div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-ui-fg-error">Error: {error}</div>
      </div>
    );
  }
  
  // Show no API key state
  if (!currentApiKeyData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-ui-fg-muted">Please select an API key to view assets</div>
      </div>
    );
  }

  // Show empty state
  if (!assetsData || assetsData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-ui-fg-muted">No assets found</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-x-auto">
      <div style={{ minWidth: '1000px' }}>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="sticky left-0 z-20 bg-ui-bg-subtle border-r border-ui-border-base shadow-md whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs">₿</span>
                  Coins
                </div>
              </Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Net Asset Value</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Balance</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Sport Cost</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Last Price</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">
                PnL
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {assetsData.map((item: AssetTableData) => (
              <Table.Row key={item.id}>
                <Table.Cell className="sticky left-0 z-10 bg-ui-bg-base border-r border-ui-border-base shadow-md whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                    </div>
                    <span className="text-ui-fg-base font-medium">{item.coin}</span>
                  </div>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-ui-fg-base">{item.netAssetValue}</span>
                    <span className="text-xs text-ui-fg-muted">{item.netAssetValueUsd}</span>
                  </div>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.balance}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.sportCost}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.lastPrice}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">
                  {item.pnl}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}