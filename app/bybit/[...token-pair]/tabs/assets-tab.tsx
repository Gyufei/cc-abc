'use client';

import { Table } from '@medusajs/ui';

import Image from 'next/image';

import { AssetTableData, useAssets } from '@/lib/api/use-assets';
import { useCurrentApiKey } from '@/lib/hooks/use-current-api-key';

/**
 * AssetsTab component displays assets table
 * Uses @medusajs/ui Table component with sticky first and last columns
 */
export function AssetsTab() {
  // Get current API key data
  const { data: currentApiKeyData } = useCurrentApiKey();

  // Get assets data with loading and error states
  const { data: assetsData, isLoading, error } = useAssets();

  // Show loading state
  if (isLoading) {
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
        <div className="text-ui-fg-error">Error: {error.message}</div>
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
      <div className="w-full h-full" style={{ minWidth: '500px' }}>
        <Table>
          <Table.Header className="sticky top-0 z-30 bg-ui-bg-subtle">
            <Table.Row>
              <Table.HeaderCell className="sticky left-0 z-20 bg-ui-bg-subtle border-r border-ui-border-base sticky-left-header-shadow whitespace-nowrap pl-3">
                <div className="flex items-center gap-2">Coins</div>
              </Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">
                Net Asset Value
              </Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">
                Available Balance
              </Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">Last Price</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {assetsData.map((item: AssetTableData) => (
              <Table.Row key={item.id}>
                <Table.Cell className="sticky left-0 z-10 bg-ui-bg-base border-r border-ui-border-base sticky-left-shadow whitespace-nowrap pl-3">
                  <div className="flex items-center gap-2">
                    <Image
                      src={`/icons/${item.coin}.svg`}
                      alt={item.coin}
                      width={16}
                      height={16}
                      className="rounded-xs"
                    />
                    <span className="text-ui-fg-base font-medium">{item.coin}</span>
                  </div>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">
                  <div className="flex flex-col">
                    <span className="text-ui-fg-base">{item.netAssetValue}</span>
                    <span className="text-xs text-ui-fg-muted">{item.netAssetValueUsd}</span>
                  </div>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">{item.balance}</Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">{item.lastPrice}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
