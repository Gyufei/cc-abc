'use client';

import { useState } from 'react';
import { Table } from '@medusajs/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useOpenOrders, OpenOrderTableData } from '@/lib/api/use-open-orders';
import { useCurrentApiKey } from '@/lib/hooks/use-current-api-key';
import { useCancelOrder } from '@/lib/api/use-cancel-order';

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
  const queryClient = useQueryClient();

  // Track canceling state for each order
  const [cancelingOrders, setCancelingOrders] = useState<Set<string>>(new Set());

  // Handle cancel order
  const handleCancelOrder = async (orderLinkId: string, symbol: string) => {
    if (!currentApiKey?.api_key) {
      console.error('No API key available');
      return;
    }

    // Add order to canceling set
    setCancelingOrders(prev => new Set(prev).add(orderLinkId));

    try {
      await cancelOrderMutation.mutateAsync({
        api_key: currentApiKey.api_key,
        category: 'spot',
        symbol: symbol,
        order_link_id: orderLinkId
      });
      
      // Refresh the orders data after successful cancellation
      queryClient.invalidateQueries({ queryKey: ['open-orders'] });
      
    } catch (error) {
      console.error('Failed to cancel order:', error);
    } finally {
      // Remove order from canceling set
      setCancelingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderLinkId);
        return newSet;
      });
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
              <Table.HeaderCell className="sticky left-0 z-20 bg-ui-bg-subtle border-r border-ui-border-base sticky-left-header-shadow whitespace-nowrap pl-3">
                Market
              </Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">Instrument</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">Order Type</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">Direction</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">Order Price</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">Filled/Order Quantity</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">Order Value</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">TP/SL</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">Trade Type</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">Order Time</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">Order ID</Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap pl-3">Reduce-Only</Table.HeaderCell>
              <Table.HeaderCell className="sticky right-0 z-20 bg-ui-bg-subtle border-l border-ui-border-base sticky-right-header-shadow whitespace-nowrap pl-3">
                Action
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {ordersData?.map((item: OpenOrderTableData) => (
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
                <Table.Cell className="whitespace-nowrap pl-3">{item.order}</Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">{item.tpSl}</Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">{item.tradeType}</Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">{item.orderTime}</Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">{item.orderId}</Table.Cell>
                <Table.Cell className="whitespace-nowrap pl-3">{item.reduceOnly}</Table.Cell>
                <Table.Cell className="sticky right-0 z-10 bg-ui-bg-base border-l border-ui-border-base sticky-right-shadow whitespace-nowrap pl-3">
                  <button 
                    onClick={() => handleCancelOrder(item.orderLinkId, item.symbol)}
                    className="text-red-600 hover:text-red-800 transition-colors border border-red-300 hover:border-red-500 rounded px-2 py-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
}