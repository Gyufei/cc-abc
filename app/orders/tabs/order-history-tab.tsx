'use client';

import { Table } from '@table-library/react-table-library/table';
import { Header, HeaderRow, HeaderCell, Body, Row, Cell } from '@table-library/react-table-library/table';
import { useTheme } from '@table-library/react-table-library/theme';
import { useOrderHistory, OrderHistoryItem } from '../../../lib/api/use-order-history';
import { useCurrentApiKey } from '../../../lib/api/use-current-api-key';

// Type definition for processed order history data for table display
interface OrderHistoryTableData {
  id: string;
  market: string;
  instrument: string;
  orderType: string;
  direction: string;
  avgFilledPrice: string;
  filled: string;
  action: string;
  originalData: OrderHistoryItem;
}

/**
 * OrderHistoryTab component displays order history table
 * Matches the design with columns: Market, Instrument, Order Type, Direction, Avg. Filled Price/Order Price, Filled/O, Action
 */
export function OrderHistoryTab() {
  // Get current API key
  const { data: currentApiKey } = useCurrentApiKey();
  
  // Fetch order history data
  const { data: orderHistoryResponse, isLoading, error } = useOrderHistory(
    currentApiKey?.api_key || 'hpQVBVCgZnFYUEPH7U', // Fallback to provided API key
    'BTCUSDT',
    1 // Last 1 day
  );
  console.log("🚀 ~ OrderHistoryTab ~ orderHistoryResponse:", orderHistoryResponse)

  // Custom theme to match existing design with sticky columns
  const theme = useTheme({
    Table: `
      --data-table-library_grid-template-columns: 120px 140px 120px 120px 200px 120px 100px;
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
      
      &:last-child {
        position: sticky;
        right: 0;
        z-index: 10;
        background-color: var(--ui-bg-subtle);
        box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
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
      
      &:last-child {
        position: sticky;
        right: 0;
        z-index: 5;
        background-color: var(--ui-bg-base);
        box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
      }
      
      &:first-child:hover,
       &:last-child:hover {
         background-color: var(--ui-bg-subtle-hover);
       }
    `
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-ui-fg-muted">Loading order history...</div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-ui-fg-error">Failed to load order history</div>
      </div>
    );
  }

  /**
   * Transform API data to table format
   */
  const transformOrderData = (orderItem: OrderHistoryItem): OrderHistoryTableData => {
    const sideText = orderItem.side === 'buy' ? 'Open Long' : 'Close Short';
    const orderTypeText = orderItem.order_type === 'market' ? 'Market' : 'Limit';
    const avgPrice = orderItem.avg_price > 0 ? orderItem.avg_price.toLocaleString() : 'N/A';
    const orderPrice = orderItem.price > 0 ? orderItem.price.toLocaleString() : 'N/A';
    const priceDisplay = `${avgPrice}/${orderPrice}`;
    const filledDisplay = `${orderItem.filled_quantity}/${orderItem.quantity}`;
    
    return {
      id: orderItem.id,
      market: orderItem.symbol,
      instrument: 'USDT Perpetuals', // Default value as not provided in API
      orderType: orderTypeText,
      direction: sideText,
      avgFilledPrice: priceDisplay,
      filled: filledDisplay,
      action: 'Details',
      originalData: orderItem
    };
  };

  // Process data for table
  const tableData = orderHistoryResponse?.data?.map(transformOrderData) || [];
  
  const data = {
    nodes: tableData
  };



  return (
    <div className="w-full h-full overflow-x-auto">
      <Table data={data} theme={theme}>
        {(tableList: OrderHistoryTableData[]) => (
          <>
            <Header>
              <HeaderRow>
                <HeaderCell>Market</HeaderCell>
                <HeaderCell>Instrument</HeaderCell>
                <HeaderCell>Order Type</HeaderCell>
                <HeaderCell>Direction</HeaderCell>
                <HeaderCell>Avg. Filled Price/Order Price</HeaderCell>
                <HeaderCell>Filled/O</HeaderCell>
                <HeaderCell>Action</HeaderCell>
              </HeaderRow>
            </Header>
            <Body>
               {tableList.map((item: OrderHistoryTableData) => (
                 <Row key={item.id} item={item}>
                   <Cell>{item.market}</Cell>
                   <Cell>{item.instrument}</Cell>
                   <Cell>{item.orderType}</Cell>
                   <Cell>
                     <span className="text-ui-green">
                       {item.direction}
                     </span>
                   </Cell>
                   <Cell>{item.avgFilledPrice}</Cell>
                   <Cell>{item.filled}</Cell>
                   <Cell>
                     <button className="smm-text text-ui-fg-muted hover:text-ui-fg-base transition-colors border border-ui-border-base rounded px-2 py-1">
                       {item.action}
                     </button>
                   </Cell>
                 </Row>
               ))}
             </Body>
          </>
        )}
      </Table>
    </div>
  );
}