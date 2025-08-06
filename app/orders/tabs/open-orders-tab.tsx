'use client';

import { Table } from '@medusajs/ui';

import { useCancelOrder } from '@/lib/api/use-cancel-order';
import { OpenOrderTableData, useOpenOrders } from '@/lib/api/use-open-orders';
import { useCurrentApiKey } from '@/lib/hooks/use-current-api-key';

/**
 * OpenOrdersTab component displays open orders table
 * Uses @medusajs/ui Table component with sticky first and last columns
 */
export function OpenOrdersTab() {
  // Get current API key data
  const { data: currentApiKey } = useCurrentApiKey();

  // Get open orders data
  const { data: ordersData, isLoading, error } = useOpenOrders();

  // Cancel order mutation
  const cancelOrderMutation = useCancelOrder();

  // Handle cancel order
  const handleCancelOrder = async (orderLinkId: string, symbol: string) => {
    if (!currentApiKey?.api_key) {
      console.error('No API key available');
      return;
    }

    try {
      await cancelOrderMutation.mutateAsync({
        api_key: currentApiKey.api_key,
        category: 'spot',
        symbol: symbol,
        order_link_id: orderLinkId,
      });
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-ui-fg-muted">Loading open orders...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-ui-fg-error">Failed to load open orders</div>
      </div>
    );
  }

  // Show empty state
  if (!ordersData || ordersData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-ui-fg-muted">No open orders found</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-x-auto">
      <div style={{ minWidth: '1600px' }}>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="sticky left-0 z-20 bg-ui-bg-subtle border-r border-ui-border-base shadow-md whitespace-nowrap">
                Market
              </Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-2">Instrument</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Order Type</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Direction</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Order Price</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">
                Filled/Order Quantity
              </Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Order Value</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">TP/SL</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Trade Type</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Order Time</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Order ID</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap">Reduce-Only</Table.HeaderCell>
              <Table.HeaderCell className="sticky right-0 z-20 bg-ui-bg-subtle border-l border-ui-border-base shadow-md whitespace-nowrap">
                Action
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {ordersData?.map((item: OpenOrderTableData) => (
              <Table.Row key={item.id}>
                <Table.Cell className="sticky left-0 z-10 bg-ui-bg-base border-r border-ui-border-base shadow-md whitespace-nowrap">
                  {item.market}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-2">{item.instrument}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.orderType}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">
                  <span className={item.direction === 'Buy' ? 'text-green-600' : 'text-red-600'}>
                    {item.direction}
                  </span>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.orderPrice}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.filledOrderQuantity}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.order}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.tpSl}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.tradeType}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.orderTime}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.orderId}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">{item.reduceOnly}</Table.Cell>
                <Table.Cell className="sticky right-0 z-10 bg-ui-bg-base border-l border-ui-border-base shadow-md whitespace-nowrap">
                  <button
                    onClick={() => handleCancelOrder(item.orderLinkId, item.symbol)}
                    className=" hover:text-red-800 transition-colors border rounded px-2 py-1 cursor-pointer"
                    disabled={cancelOrderMutation.isPending}
                  >
                    {cancelOrderMutation.isPending ? 'Canceling...' : 'Cancel'}
                  </button>
                </Table.Cell>
              </Table.Row>
            )) || []}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
