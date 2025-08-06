'use client';

import { Table } from '@table-library/react-table-library/table';
import { Header, HeaderRow, HeaderCell, Body, Row, Cell } from '@table-library/react-table-library/table';
import { useTheme } from '@table-library/react-table-library/theme';
import { useAssets, AssetTableData } from '@/lib/api/use-assets';
import { useCurrentApiKey } from '@/lib/hooks/use-current-api-key';

/**
 * AssetsTab component displays assets table
 * Matches the design with columns: Coins, Net Asset Aalue, Balance, Sport Cost, Last Price, PnL
 */
export function AssetsTab() {
  // Custom theme to match existing design
  const theme = useTheme({
    Table: `
      --data-table-library_grid-template-columns: 140px 160px 140px 120px 140px 120px;
      border-collapse: collapse;
      width: 100%;
      background-color: var(--ui-bg-base);
    `,
    Header: `
      background-color: var(--ui-bg-subtle);
    `,
    HeaderRow: `
      border-bottom: 1px solid var(--ui-border-base);
    `,
    HeaderCell: `
      padding: 12px 16px;
      text-align: left;
      font-size: 14px;
      color: var(--ui-fg-muted);
      font-weight: 500;
      background-color: var(--ui-bg-subtle);
    `,
    Row: `
      border-bottom: 1px solid var(--ui-border-base);
      background-color: var(--ui-bg-base);
      &:hover {
        background-color: var(--ui-bg-subtle-hover);
      }
    `,
    Cell: `
      padding: 12px 16px;
      font-size: 14px;
      color: var(--ui-fg-base);
      background-color: var(--ui-bg-base);
    `
  });

  // Get current API key data
  const { data: currentApiKeyData } = useCurrentApiKey();
  
  // Get assets data with loading and error states
  const { data: assetsData, loading, error } = useAssets('unified');
  
  // Transform data for react-table-library format
  const data = {
    nodes: assetsData
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-ui-fg-muted">Loading assets...</div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-ui-red">Error: {error}</div>
      </div>
    );
  }
  
  // Show no API key state
  if (!currentApiKeyData) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-ui-fg-muted">Please select an API key to view assets</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Table data={data} theme={theme}>
        {(tableList: AssetTableData[]) => (
          <>
            <Header>
              <HeaderRow>
                <HeaderCell>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs">₿</span>
                    Coins
                  </div>
                </HeaderCell>
                <HeaderCell>Net Asset Aalue</HeaderCell>
                <HeaderCell>Balance</HeaderCell>
                <HeaderCell>Sport Cost</HeaderCell>
                <HeaderCell>Last Price</HeaderCell>
                <HeaderCell>PnL</HeaderCell>
              </HeaderRow>
            </Header>
            <Body>
              {tableList.map((item: AssetTableData) => (
                <Row key={item.id} item={item}>
                  <Cell>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-white"></span>
                      </div>
                      <span className="smm-text text-ui-fg-base font-medium">{item.coin}</span>
                    </div>
                  </Cell>
                  <Cell>
                    <div className="flex flex-col">
                      <span className="smm-text text-ui-fg-base">{item.netAssetValue}</span>
                      <span className="text-xs text-ui-fg-muted">{item.netAssetValueUsd}</span>
                    </div>
                  </Cell>
                  <Cell>{item.balance}</Cell>
                  <Cell>{item.sportCost}</Cell>
                  <Cell>{item.lastPrice}</Cell>
                  <Cell>{item.pnl}</Cell>
                </Row>
              ))}
            </Body>
          </>
        )}
      </Table>
    </div>
  );
}