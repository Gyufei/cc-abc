'use client';

import { Table } from '@medusajs/ui';

import { useMemo } from 'react';

import Image from 'next/image';

import { AssetTableData, useAssets } from '@/lib/api/use-assets';
import { useTokenPairs } from '@/lib/api/use-token-pairs';
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

  const { data: tokenPairs } = useTokenPairs();

  const tokenImgsMap = useMemo(() => {
    const imgMap = new Map<string, string>();

    for (const tokenPair of tokenPairs || []) {
      imgMap.set(tokenPair.base_asset, tokenPair.base_asset_logo_url);
      imgMap.set(tokenPair.quote_asset, tokenPair.quote_asset_logo_url);
    }

    return imgMap;
  }, [tokenPairs]);

  return (
    <div className="w-full h-full overflow-x-auto">
      <div className="w-full h-full" style={{ minWidth: '500px' }}>
        <Table>
          <Table.Header className="sticky top-0 z-20 bg-ui-bg-subtle">
            <Table.Row>
              <Table.HeaderCell className="sticky left-0 z-10 bg-ui-bg-subtle border-r border-ui-border-base sticky-left-header-shadow whitespace-nowrap pl-3">
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
            {(!assetsData?.length || isLoading || error || !currentApiKeyData) && (
              <Table.Row>
                <td colSpan={12} className="text-center h-30">
                  {isLoading
                    ? 'Loading assets...'
                    : error
                      ? error.message
                        ? error.message
                        : 'Failed to load assets'
                      : !currentApiKeyData
                        ? 'Please select an API key to view assets'
                        : 'No assets found'}
                </td>
              </Table.Row>
            )}
            {(assetsData || []).map((item: AssetTableData) => (
              <Table.Row key={item.id}>
                <Table.Cell className="sticky left-0 z-10 bg-ui-bg-base border-r border-ui-border-base sticky-left-shadow whitespace-nowrap pl-3">
                  <div className="flex items-center gap-2">
                    <Image
                      src={tokenImgsMap.get(item.coin) || ''}
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
