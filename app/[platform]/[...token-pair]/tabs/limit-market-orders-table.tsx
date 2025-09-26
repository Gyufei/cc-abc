'use client';

import { Table } from '@medusajs/ui';

import { OpenOrderItem, OpenOrderTableData } from '@/lib/api/use-open-orders';
import { useTokenPairs } from '@/lib/api/use-token-pairs';
import { TokenPair } from '@/lib/types/asset';
import { fixedNumber } from '@/lib/utils/number';

/**
 * Transform raw order data from API to table display format
 * @param orders - Raw order data from API
 * @returns Transformed data for table display
 */
function transformOrderData(
  orders: OpenOrderItem[],
  tokenPairs: TokenPair[] | undefined
): OpenOrderTableData[] {
  if (!tokenPairs) {
    return [];
  }

  return orders.map((order) => {
    const tokenPair = (tokenPairs || []).find((pair) => pair.symbol === order.symbol);
    const bCoin = tokenPair?.base_asset;
    const qCoin = tokenPair?.quote_asset;

    const minimumFractionDigitsForBase = Math.abs(Math.log10(Number(tokenPair?.base_asset_step)));
    const minimumFractionDigitsForQuote = Math.abs(Math.log10(Number(tokenPair?.quote_asset_step)));
    const minimumFractionDigitsForPrice = Math.abs(Math.log10(Number(tokenPair?.price_filter_tick_size)));

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

    const tpSlText =
      order.take_profit > 0 || order.stop_loss > 0
        ? `${order.take_profit > 0 ? order.take_profit.toFixed(2) : '--'}/${order.stop_loss > 0 ? order.stop_loss.toFixed(2) : '--'}`
        : '--';

    return {
      id: order.id,
      market: order.symbol,
      instrument: 'Spot', // Default to Spot for now
      orderType: order.order_type,
      direction: order.side,
      orderPrice: fixedNumber(order.price, minimumFractionDigitsForPrice),
      filledOrderQuantity: `${fixedNumber(order.filled_quantity, minimumFractionDigitsForBase)}/${fixedNumber(order.quantity, minimumFractionDigitsForBase)} ${bCoin}`,
      orderValue: `${fixedNumber(order.leaves_value, minimumFractionDigitsForQuote)} ${qCoin}`,
      tpSl: tpSlText,
      tradeType: '--', // Default value、Open Long
      orderTime: orderTime,
      orderId: order.order_id,
      // reduceOnly: order.reduce_only ? 'Yes' : 'No',
      reduceOnly: '--',
      orderLinkId: order.order_link_id,
      symbol: order.symbol,
      status: order.status, // Include status for filtering
    };
  });
}

interface LimitMarketOrdersTableProps {
  data: OpenOrderItem[];
  cancelingOrders: Set<string>;
  onCancelOrder: (orderLinkId: string, symbol: string, orderId: string) => void;
  isLoading: boolean;
  error: Error | null;
}

/**
 * LimitMarketOrdersTable component displays limit and market orders
 * Shows all standard order columns including filled quantity, order value, etc.
 */
export function LimitMarketOrdersTable({
  data,
  cancelingOrders,
  onCancelOrder,
  isLoading,
  error,
}: LimitMarketOrdersTableProps) {
  const { data: tokenPairs } = useTokenPairs();

  // Transform raw order data to table format
  const transformedData = transformOrderData(data, tokenPairs);

  return (
    <div className="w-full h-full" style={{ minWidth: '1500px' }}>
      <Table>
        <Table.Header className="sticky top-0 z-20 bg-ui-bg-subtle">
          <Table.Row>
            <Table.HeaderCell className="sticky left-0 z-10 bg-ui-bg-subtle border-r border-ui-border-base sticky-left-header-shadow whitespace-nowrap pl-3">
              Market
            </Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap pl-3">Instrument</Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap pl-3">Order Type</Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap pl-3">Direction</Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap pl-3">Order Price</Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap pl-3">
              Filled/Order Quantity
            </Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap pl-3">Order Value</Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap pl-3">TP/SL</Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap pl-3">Trade Type</Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap pl-3">Order Time</Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap pl-3">Order ID</Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap pl-3">Reduce-Only</Table.HeaderCell>
            <Table.HeaderCell className="sticky right-0 z-10 bg-ui-bg-subtle border-l border-ui-border-base sticky-right-header-shadow whitespace-nowrap pl-3">
              Action
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {(!transformedData?.length || isLoading || error) && (
            <Table.Row>
              <td colSpan={13} className="text-center h-30">
                {isLoading
                  ? 'Loading limit & market orders...'
                  : error
                    ? 'Failed to load limit & market orders'
                    : 'No limit & market orders found'}
              </td>
            </Table.Row>
          )}
          {transformedData?.map((item: OpenOrderTableData) => (
            <Table.Row key={item.id}>
              <Table.Cell className="sticky left-0 z-10 bg-ui-bg-base border-r border-ui-border-base sticky-left-shadow whitespace-nowrap pl-3">
                {item.market}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">{item.instrument}</Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">{item.orderType}</Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">
                <span className={item.direction === 'Buy' ? 'text-green-600' : 'text-red-600'}>
                  {item.direction}
                </span>
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">{item.orderPrice}</Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">{item.filledOrderQuantity}</Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">{item.orderValue}</Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">{item.tpSl}</Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">{item.tradeType}</Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">{item.orderTime}</Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">{item.orderId}</Table.Cell>
              <Table.Cell className="whitespace-nowrap pl-3">{item.reduceOnly}</Table.Cell>
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
