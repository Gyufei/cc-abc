'use client';

import { Table } from '@medusajs/ui';
import { useTradeExecutions, TradeExecutionItem } from '../../../lib/api/use-trade-executions';
import { useCurrentApiKey } from '@/lib/hooks/use-current-api-key';

// Type definition for processed trade history data for table display
interface TradeHistoryTableData {
  id: string;
  market: string;
  instrument: string;
  orderType: string;
  direction: string;
  filledValue: string;
  filledPrice: string;
  filledQty: string;
  filledType: string;
  tradingFees: string;
  transactionTime: string;
  transactionId: string;
  impliedVolatility: string;
  indexPrice: string;
  originalData: TradeExecutionItem;
}

/**
 * TradeHistoryTab component displays trade history table
 * Uses @medusajs/ui Table component with sticky first and last columns
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

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-ui-fg-muted">Loading trade history...</div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
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
    const filledValue = `${tradeItem.exec_value} USDT`;
    const filledPrice = `${tradeItem.exec_price}`;
    const filledQty = `${tradeItem.exec_qty} BTC`;
    const filledType = 'Trade'; // Default value for filled type
    const tradingFees = `${(tradeItem.exec_fee || 0)} USDT`;
    const indexPrice = tradeItem.index_price ? `${tradeItem.index_price}` : '--';
    const transactionTime = new Date(tradeItem.exec_time).toLocaleString('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace('T', ' ');
    const transactionId = tradeItem.id;
    const impliedVolatility = '--'; // Default value as not provided in current API
    
    return {
      id: tradeItem.id,
      market: tradeItem.symbol,
      instrument: 'USDT Perpetuals', // Default value as not provided in API
      orderType: orderTypeText,
      direction: sideText,
      filledValue: filledValue,
      filledPrice: filledPrice,
      filledQty: filledQty,
      filledType: filledType,
      tradingFees: tradingFees,
      transactionTime: transactionTime,
      transactionId: transactionId,
      impliedVolatility: impliedVolatility,
      indexPrice: indexPrice,
      originalData: tradeItem
    };
  };

  // Process data for table
  const tableData = tradeExecutionResponse?.data?.map(transformTradeData) || [];

  // Show empty state
  if (tableData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-ui-fg-muted">No trade history found</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-x-auto">
      <div style={{ minWidth: '1800px' }}>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="sticky left-0 z-20 bg-ui-bg-subtle border-r border-ui-border-base shadow-md whitespace-nowrap">
                Market
              </Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Instrument</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Order Type</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Direction</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Filled Value</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Filled Price</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Filled Qty</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Filled Type</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Trading Fees</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Transaction Time</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Transaction ID</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Implied Volatility</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">
                Index Price
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tableData.map((item: TradeHistoryTableData) => (
              <Table.Row key={item.id}>
                <Table.Cell className="sticky left-0 z-10 bg-ui-bg-base border-r border-ui-border-base shadow-md whitespace-nowrap">
                  {item.market}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.instrument}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.orderType}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">
                  <span className={item.direction.includes('Long') ? 'text-green-600' : 'text-red-600'}>
                    {item.direction}
                  </span>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.filledValue}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.filledPrice}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.filledQty}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.filledType}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.tradingFees}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.transactionTime}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.transactionId}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.impliedVolatility}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">
                  {item.indexPrice}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}