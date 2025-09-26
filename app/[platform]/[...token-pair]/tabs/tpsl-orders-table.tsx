'use client';

import { Table } from '@medusajs/ui';

import { OpenOrderItem, OpenOrderTableData } from '@/lib/api/use-open-orders';
import { getSymbolToken } from '@/lib/configs/token';
import { fixedNumber } from '@/lib/utils/number';

/**
 * Transform raw order data from API to table display format for TP/SL orders
 * @param orders - Raw order data from API
 * @returns Transformed data for table display
 */
function transformOrderData(orders: OpenOrderItem[]): OpenOrderTableData[] {
  return orders.map((order): OpenOrderTableData => {
    const [baseCoin, quoteCoin] = getSymbolToken(order.symbol);
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
            TP {fixedNumber(order.take_profit, 2)}
            <br />
            SL {fixedNumber(order.stop_loss, 2)}
          </>
        );
      } else if (order.take_profit > 0) {
        return `TP ${fixedNumber(order.take_profit, 2)} (Last)`;
      } else if (order.stop_loss > 0) {
        return `SL ${fixedNumber(order.stop_loss, 2)} (Last)`;
      }
      return order.trigger_price > 0 ? fixedNumber(order.trigger_price, 2) : '--';
    };
    const orderPriceText = (
      <>
        TP Market
        <br />
        SL Market
      </>
    );
    return {
      id: order.id,
      market: order.symbol,
      instrument: 'Spot', // Default to Spot for now
      orderType: order.order_type,
      direction: order.side,
      orderPrice: orderPriceText,
      filledOrderQuantity: `${order.leaves_qty ? order.leaves_qty + ' ' + baseCoin : '--'}`, // TP/SL typically close entire position
      orderValue: `${order.leaves_value ? fixedNumber(order.leaves_value, 7) + ' ' + quoteCoin : '--'}`, // Order value not applicable for TP/SL
      tpSl: triggerPriceText(),
      tradeType: '--', // TP/SL are closing positions
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
  onCancelOrder: (orderLinkId: string, symbol: string, orderId: string) => void;
  isLoading: boolean;
  error: Error | null;
}

/**
 * TPSLOrdersTable component displays TP/SL (Take Profit/Stop Loss) orders
 * Shows specialized columns for TP/SL orders including trigger price and order status
 */
export function TPSLOrdersTable({
  data,
  cancelingOrders,
  onCancelOrder,
  isLoading,
  error,
}: TPSLOrdersTableProps) {
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
          {(!transformedData?.length || isLoading || error) && (
            <Table.Row>
              <td colSpan={12} className="text-center h-30">
                {isLoading
                  ? 'Loading TP/SL orders...'
                  : error
                    ? 'Failed to load TP/SL orders'
                    : 'No TP/SL orders found'}
              </td>
            </Table.Row>
          )}
          {transformedData?.map((item: OpenOrderTableData) => (
            <Table.Row key={item.id}>
              <Table.Cell className="sticky left-0 z-10 bg-ui-bg-base border-r border-ui-border-base sticky-left-shadow whitespace-nowrap pl-3">
                {item.market}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">{item.instrument}</Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">
                <span className={`capitalize ${item.direction === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                  {item.direction}
                </span>
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">{item.tpSl}</Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">{item.orderPrice}</Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">{item.filledOrderQuantity}</Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">{item.orderValue}</Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">{item.tradeType}</Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">{item.orderTime}</Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">{item.orderId}</Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">
                <span
                  className={`capitalize ${item.status === 'Untriggered' ? 'text-yellow-600' : 'text-gray-600'}`}
                >
                  {item.status}
                </span>
              </Table.Cell>
              <Table.Cell className="sticky right-0 z-10 bg-ui-bg-base border-l border-ui-border-base sticky-right-shadow whitespace-nowrap pl-3">
                <button
                  onClick={() => onCancelOrder(item.orderLinkId, item.symbol, item.orderId)}
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
