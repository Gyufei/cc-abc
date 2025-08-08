'use client';

import { Table } from '@medusajs/ui';

import { OpenOrderItem, OpenOrderTableData } from '@/lib/api/use-open-orders';

/**
 * Transform raw order data from API to table display format for TP/SL orders
 * @param orders - Raw order data from API
 * @returns Transformed data for table display
 */
function transformOrderData(orders: OpenOrderItem[]): OpenOrderTableData[] {
  return orders.map((order) => {
    const orderTime = new Date(order.created_at)
      .toLocaleString('sv-SE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      .replace('T', ' ');

    // Format trigger price for TP/SL orders with line breaks
    const triggerPriceText = () => {
      if (order.take_profit > 0 && order.stop_loss > 0) {
        return (
          <>
            TP {order.take_profit.toLocaleString('en-US')} (Last)
            <br />
            SL {order.stop_loss.toLocaleString('en-US')} (Last)
          </>
        );
      } else if (order.take_profit > 0) {
        return `TP ${order.take_profit.toLocaleString('en-US')} (Last)`;
      } else if (order.stop_loss > 0) {
        return `SL ${order.stop_loss.toLocaleString('en-US')} (Last)`;
      }
      return order.trigger_price > 0 ? order.trigger_price.toLocaleString('en-US') : '--';
    };

    return {
      id: order.id,
      market: order.symbol,
      instrument: 'Spot', // Default to Spot for now
      orderType: order.order_type,
      direction: order.side,
      orderPrice: 'Market', // TP/SL orders are typically market orders when triggered
      filledOrderQuantity: 'Entire Position', // TP/SL typically close entire position
      order: '--', // Order value not applicable for TP/SL
      tpSl: triggerPriceText(),
      tradeType: order.side === 'buy' ? 'Close Short' : 'Close Long', // TP/SL are closing positions
      orderTime: orderTime,
      orderId: order.order_id,
      reduceOnly: '--',
      orderLinkId: order.order_link_id,
      symbol: order.symbol,
      status: order.status,
    };
  });
}

interface TPSLOrdersTableProps {
  data: OpenOrderItem[];
  cancelingOrders: Set<string>;
  onCancelOrder: (orderLinkId: string, symbol: string) => void;
}

/**
 * TPSLOrdersTable component displays TP/SL (Take Profit/Stop Loss) orders
 * Shows specialized columns for TP/SL orders including trigger price and order status
 */
export function TPSLOrdersTable({ data, cancelingOrders, onCancelOrder }: TPSLOrdersTableProps) {
  // Transform raw order data to table format
  const transformedData = transformOrderData(data);

  return (
    <div className="w-full h-full" style={{ minWidth: '1200px' }}>
      <Table>
        <Table.Header className="sticky top-0 z-20 bg-ui-bg-subtle">
          <Table.Row>
            <Table.HeaderCell className="sticky left-0 z-10 bg-ui-bg-subtle border-r border-ui-border-base sticky-left-header-shadow whitespace-nowrap pl-3">
              Market
            </Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap pl-3">Instrument</Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap pl-3">Direction</Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap pl-3">Trigger Price</Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap pl-3">Order Price</Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap pl-3">Order Qty</Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap pl-3">Order Value</Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap pl-3">Trade Type</Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap pl-3">Order Time</Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap pl-3">Order ID</Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap pl-3">Order Status</Table.HeaderCell>
            <Table.HeaderCell className="sticky right-0 z-10 bg-ui-bg-subtle border-l border-ui-border-base sticky-right-header-shadow whitespace-nowrap pl-3">
              Action
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {transformedData?.map((item: OpenOrderTableData) => (
            <Table.Row key={item.id}>
              <Table.Cell className="sticky left-0 z-10 bg-ui-bg-base border-r border-ui-border-base sticky-left-shadow whitespace-nowrap pl-3">
                {item.market}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">{item.instrument}</Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">
                <span className={item.direction === 'Buy' ? 'text-green-600' : 'text-red-600'}>
                  {item.direction}
                </span>
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">{item.tpSl}</Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">{item.orderPrice}</Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">{item.filledOrderQuantity}</Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">{item.order}</Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">
                <span
                  className={item.tradeType === 'Close Short' ? 'text-green-600' : 'text-red-600'}
                >
                  {item.tradeType}
                </span>
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">{item.orderTime}</Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">
                <>
                  {item.orderId}
                  <br />
                  {item.orderLinkId}
                </>
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">
                <span
                  className={item.status === 'Untriggered' ? 'text-yellow-600' : 'text-gray-600'}
                >
                  {item.status}
                </span>
              </Table.Cell>
              <Table.Cell className="sticky right-0 z-10 bg-ui-bg-base border-l border-ui-border-base sticky-right-shadow whitespace-nowrap pl-3">
                <button
                  onClick={() => onCancelOrder(item.orderLinkId, item.symbol)}
                  className="hover:text-red-800 transition-colors border hover:border-red-500 rounded px-2 py-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={cancelingOrders.has(item.orderLinkId)}
                >
                  {cancelingOrders.has(item.orderLinkId) ? 'Canceling...' : 'Cancel'}
                </button>
              </Table.Cell>
            </Table.Row>
          )) || []}
        </Table.Body>
      </Table>
    </div>
  );
}
