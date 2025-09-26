'use client';

import { useState } from 'react';

import { useCancelOrder } from '@/lib/api/use-cancel-order';
import { useOpenOrders } from '@/lib/api/use-open-orders';
import { useCurrentApiKey } from '@/lib/hooks/use-current-api-key';

import { LimitMarketOrdersTable } from './limit-market-orders-table';
import { OrderFilter } from './order-filter';
import { TPSLOrdersTable } from './tpsl-orders-table';

/**
 * OpenOrdersTab component displays open orders table
 * Uses @medusajs/ui Table component with sticky first and last columns
 */
export function OpenOrdersTab({
  showAllMarkets,
  baseCoin,
  quoteCoin,
}: {
  showAllMarkets: boolean;
  baseCoin: string | null;
  quoteCoin: string | null;
}) {
  // Get current API key data
  const { data: currentApiKey } = useCurrentApiKey();

  // Get open orders data
  const {
    data: ordersData,
    isLoading,
    error,
  } = useOpenOrders(showAllMarkets && baseCoin && quoteCoin ? '' : `${baseCoin}${quoteCoin}`);

  // Cancel order mutation
  const cancelOrderMutation = useCancelOrder();

  // Track canceling state for each order
  const [cancelingOrders, setCancelingOrders] = useState<Set<string>>(new Set());

  // Filter and split data based on status
  // Separate orders with status "Untriggered" into TP/SL data
  const limitMarketData =
    ordersData?.filter((order) => {
      // Filter orders that are NOT "Untriggered" for Limit & Market Orders tab
      return order.status !== 'Untriggered';
    }) || [];

  const tpslData =
    ordersData?.filter((order) => {
      // Filter orders with status "Untriggered" for TP/SL tab
      return order.status === 'Untriggered';
    }) || [];

  const FilterTabs = [
    {
      label: `Limit & Market Orders (${limitMarketData.length})`,
      value: 'limit-market',
    },
    {
      label: `TP/SL (${tpslData.length})`,
      value: 'tp-sl',
    },
  ];

  const [activeFilterStatus, setActiveFilterStatus] = useState(FilterTabs[0].value);

  // Get current data based on active filter
  const currentData = activeFilterStatus === 'tp-sl' ? tpslData : limitMarketData;

  // Handle cancel order
  const handleCancelOrder = async (orderLinkId: string, symbol: string, orderId: string) => {
    if (!currentApiKey?.api_key) {
      console.error('No API key available');
      return;
    }

    // Add order to canceling set
    setCancelingOrders((prev) => new Set(prev).add(orderLinkId));

    try {
      await cancelOrderMutation.mutateAsync({
        api_key: currentApiKey.api_key,
        category: 'spot',
        symbol: symbol,
        order_link_id: orderLinkId,
        order_id: orderId,
      });
    } catch (error) {
      console.error('Failed to cancel order:', error);
    } finally {
      // Remove order from canceling set
      setCancelingOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderLinkId);
        return newSet;
      });
    }
  };

  return (
    <div className="">
      <div className="py-[10px] px-6 flex items-center select-none">
        <OrderFilter
          options={FilterTabs}
          activeTab={activeFilterStatus}
          setActiveTab={setActiveFilterStatus}
        />
      </div>
      <div className="w-full h-full overflow-auto">
        {activeFilterStatus === 'tp-sl' ? (
          <TPSLOrdersTable
            data={currentData}
            cancelingOrders={cancelingOrders}
            onCancelOrder={handleCancelOrder}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <LimitMarketOrdersTable
            data={currentData}
            cancelingOrders={cancelingOrders}
            onCancelOrder={handleCancelOrder}
            isLoading={isLoading}
            error={error}
          />
        )}
      </div>
    </div>
  );
}
