'use client';

import { Table } from '@medusajs/ui';

import { TradeExecutionItem, useTradeExecutions } from '../../../lib/api/use-trade-executions';

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
  // Fetch trade execution data
  const {
    data: tradeExecutionResponse,
    isLoading,
    error,
  } = useTradeExecutions(
    'BTCUSDT',
    7 // Last 7 days
  );
  console.log('🚀 ~ TradeHistoryTab ~ tradeExecutionResponse:', tradeExecutionResponse);

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
    // const sideText = tradeItem.side.toLowerCase() === 'buy' ? 'Open Long' : 'Close Short';
    const sideText = tradeItem.side;
    const orderTypeText = tradeItem.order_type;
    const filledValue = `${tradeItem.exec_value} USDT`;
    const filledPrice = `${tradeItem.exec_price}`;
    const filledQty = `${tradeItem.exec_qty} BTC`;
    const filledType = 'Trade'; // Default value for filled type
    const tradingFees = `${tradeItem.exec_fee || 0} USDT`;
    const indexPrice = tradeItem.index_price ? `${tradeItem.index_price}` : '--';
    const transactionTime = new Date(tradeItem.exec_time)
      .toLocaleString('sv-SE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      .replace('T', ' ');
    const transactionId = tradeItem.id;
    const impliedVolatility = '--'; // Default value as not provided in current API

    return {
      id: tradeItem.id,
      market: tradeItem.symbol,
      instrument: 'Spot', // Default value as not provided in API
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
      originalData: tradeItem,
    };
  };

  // Process data for table
  const tableData = tradeExecutionResponse?.map(transformTradeData) || [];

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
              <Table.HeaderCell className="sticky left-0 z-20 bg-ui-bg-subtle border-r border-ui-border-base sticky-left-header-shadow whitespace-nowrap pl-3">
                Market
              </Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">Instrument</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">Order Type</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">Direction</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">Filled Value</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">Filled Price</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">Filled Qty</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">Filled Type</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">Trading Fees</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">
                Transaction Time
              </Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">Transaction ID</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">
                Implied Volatility
              </Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">Index Price</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tableData.map((item: TradeHistoryTableData) => (
              <Table.Row key={item.id}>
                <Table.Cell className="sticky left-0 z-10 bg-ui-bg-base border-r border-ui-border-base sticky-left-shadow whitespace-nowrap pl-3">
                  {item.market}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">{item.instrument}</Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">{item.orderType}</Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">
                  <span
                    className={item.direction === "Buy" ? 'text-green-600' : 'text-red-600'}
                  >
                    {item.direction}
                  </span>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">{item.filledValue}</Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">{item.filledPrice}</Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">{item.filledQty}</Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">{item.filledType}</Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">{item.tradingFees}</Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">{item.transactionTime}</Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">{item.transactionId}</Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">{item.impliedVolatility}</Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">{item.indexPrice}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
