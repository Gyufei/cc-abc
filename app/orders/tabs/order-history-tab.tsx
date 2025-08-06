'use client';

import { Table } from '@medusajs/ui';
import { useOrderHistory, OrderHistoryItem } from '../../../lib/api/use-order-history';
import { useCurrentApiKey } from '@/lib/hooks/use-current-api-key';

// Type definition for processed order history data for table display
interface OrderHistoryTableData {
  id: string;
  market: string;
  instrument: string;
  orderType: string;
  direction: string;
  avgFilledPrice: string;
  filledOrderQuantity: string;
  orderTime: string;
  orderId: string;
  filledOrderValue: string;
  orderStatus: string;
  tradingFees: string;
  originalData: OrderHistoryItem;
}

/**
 * OrderHistoryTab component displays order history table
 * Uses @medusajs/ui Table component with sticky first and last columns
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
    const sideText = orderItem.side === 'buy' ? 'Open Long' : 'Open Short';
    const orderTypeText = orderItem.order_type === 'market' ? 'Market' : 'Limit';
    const avgPrice = orderItem.avg_price > 0 ? orderItem.avg_price.toLocaleString() : 'N/A';
    const orderPrice = orderItem.price > 0 ? orderItem.price.toLocaleString() : 'N/A';
    const priceDisplay = `${avgPrice}/${orderPrice}`;
    const filledQuantityDisplay = `${orderItem.filled_quantity}/${orderItem.quantity}`;
    const orderTime = new Date(orderItem.created_at).toLocaleString('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace('T', ' ');
    const filledValue = `${orderItem.cum_exec_value.toFixed(2)}/$${orderItem.leaves_value.toFixed(2)} USDT`;
    const tradingFees = `${orderItem.cum_exec_fee.toFixed(8)} USDT`;
    
    return {
      id: orderItem.id,
      market: orderItem.symbol,
      instrument: 'USDT Perpetuals', // Default value as not provided in API
      orderType: orderTypeText,
      direction: sideText,
      avgFilledPrice: priceDisplay,
      filledOrderQuantity: filledQuantityDisplay,
      orderTime: orderTime,
      orderId: orderItem.order_id,
      filledOrderValue: filledValue,
      orderStatus: orderItem.status.charAt(0).toUpperCase() + orderItem.status.slice(1),
      tradingFees: tradingFees,
      originalData: orderItem
    };
  };

  // Process data for table
  const tableData = orderHistoryResponse?.data?.map(transformOrderData) || [];



  return (
    <div className="w-full h-full overflow-x-auto">
      <div style={{ minWidth: '1500px' }}>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="sticky left-0 z-20 bg-ui-bg-subtle border-r border-ui-border-base shadow-md whitespace-nowrap">
                Market
              </Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Instrument</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Order Type</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Direction</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Avg. Filled Price/Order Price</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Filled/Order Quantity</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Order Time</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Order ID</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Filled/Order Value</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Order Status</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Trading Fees</Table.HeaderCell>
              {/* <Table.HeaderCell className="sticky right-0 z-20 bg-ui-bg-subtle border-l border-ui-border-base shadow-md whitespace-nowrap">
                Action
              </Table.HeaderCell> */}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tableData.map((item: OrderHistoryTableData) => (
              <Table.Row key={item.id}>
                <Table.Cell className="sticky left-0 z-10 bg-ui-bg-base border-r border-ui-border-base shadow-md whitespace-nowrap">
                  {item.market}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.instrument}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.orderType}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">
                  <span className="text-green-600">
                    {item.direction}
                  </span>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.avgFilledPrice}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.filledOrderQuantity}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.orderTime}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.orderId}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.filledOrderValue}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">
                  <span className={item.orderStatus === 'Filled' ? 'text-green-600' : 'text-gray-600'}>
                    {item.orderStatus}
                  </span>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.tradingFees}</Table.Cell>
                {/* <Table.Cell className="sticky right-0 z-10 bg-ui-bg-base border-l border-ui-border-base shadow-md whitespace-nowrap">
                  <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors border border-gray-300 rounded px-2 py-1">
                    Details
                  </button>
                </Table.Cell> */}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}