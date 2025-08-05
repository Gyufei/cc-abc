'use client';

import { Table } from '@table-library/react-table-library/table';
import { Header, HeaderRow, HeaderCell, Body, Row, Cell } from '@table-library/react-table-library/table';
import { useTheme } from '@table-library/react-table-library/theme';
import { useTradeExecutions, TradeExecutionItem } from '../../../lib/api/use-trade-executions';
import { useCurrentApiKey } from '../../../lib/api/use-current-api-key';

// Type definition for processed trade history data for table display
interface TradeHistoryTableData {
  id: string;
  market: string;
  instrument: string;
  orderType: string;
  direction: string;
  filledValue: string;
  filledPrice: string;
  indexPrice: string;
  originalData: TradeExecutionItem;
}

/**
 * TradeHistoryTab component displays trade history table
 * Matches the design with columns: Market, Instrument, Order Type, Direction, Filled Value, Filled Pri, Index Price
 */
export function TradeHistoryTab() {
  // Get current API key
  const { data: currentApiKey } = useCurrentApiKey();
  
  // Fetch trade execution data
  const { data: tradeExecutionResponse, isLoading, error } = useTradeExecutions(
    currentApiKey?.api_key || 'hpQVBVCgZnFYUEPH7U', // Fallback to provided API key
    'BTCUSDT',
    7 // Last 7 days
  );
  console.log("🚀 ~ TradeHistoryTab ~ tradeExecutionResponse:", tradeExecutionResponse);

  // Custom theme to match existing design with sticky first column
  const theme = useTheme({
    Table: `
      --data-table-library_grid-template-columns: 120px 140px 120px 120px 180px 120px 120px;
      border-collapse: collapse;
      width: 100%;
      background-color: var(--ui-bg-base);
      overflow-x: auto;
      position: relative;
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
      
      &:first-child {
        position: sticky;
        left: 0;
        z-index: 10;
        background-color: var(--ui-bg-subtle);
        box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
      }
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
      
      &:first-child {
        position: sticky;
        left: 0;
        z-index: 5;
        background-color: var(--ui-bg-base);
        box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
      }
      
      &:first-child:hover {
         background-color: var(--ui-bg-subtle-hover);
       }
    `
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-ui-fg-muted">Loading trade history...</div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-ui-fg-error">Failed to load trade history</div>
      </div>
    );
  }

  /**
   * Transform API data to table format
   */
  const transformTradeData = (tradeItem: TradeExecutionItem): TradeHistoryTableData => {
    const sideText = tradeItem.side.toLowerCase() === 'buy' ? 'Open Long' : 'Close Short';
    const orderTypeText = tradeItem.order_type === 'Limit' ? 'Limit' : 'Market';
    const filledValue = `${tradeItem.exec_value.toLocaleString()} USDT`;
    const filledPrice = tradeItem.exec_price.toLocaleString();
    const indexPrice = tradeItem.index_price ? tradeItem.index_price.toLocaleString() : '--';
    
    return {
      id: tradeItem.id,
      market: tradeItem.symbol,
      instrument: 'USDT perpetuals', // Default value as not provided in API
      orderType: orderTypeText,
      direction: sideText,
      filledValue: filledValue,
      filledPrice: filledPrice,
      indexPrice: indexPrice,
      originalData: tradeItem
    };
  };

  // Process data for table
  const tableData = tradeExecutionResponse?.data?.map(transformTradeData) || [];
  
  const data = {
    nodes: tableData
  };

  return (
    <div className="w-full h-full overflow-x-auto">
      <Table data={data} theme={theme}>
        {(tableList: TradeHistoryTableData[]) => (
          <>
            <Header>
              <HeaderRow>
                <HeaderCell>Market</HeaderCell>
                <HeaderCell>Instrument</HeaderCell>
                <HeaderCell>Order Type</HeaderCell>
                <HeaderCell>Direction</HeaderCell>
                <HeaderCell>Filled Value</HeaderCell>
                <HeaderCell>Filled Pri</HeaderCell>
                <HeaderCell>Index Price</HeaderCell>
              </HeaderRow>
            </Header>
            <Body>
              {tableList.map((item: TradeHistoryTableData) => (
                <Row key={item.id} item={item}>
                  <Cell>{item.market}</Cell>
                  <Cell>{item.instrument}</Cell>
                  <Cell>{item.orderType}</Cell>
                  <Cell>
                    <span className="text-ui-green">
                      {item.direction}
                    </span>
                  </Cell>
                  <Cell>{item.filledValue}</Cell>
                  <Cell>{item.filledPrice}</Cell>
                  <Cell>{item.indexPrice}</Cell>
                </Row>
              ))}
            </Body>
          </>
        )}
      </Table>
    </div>
  );
}