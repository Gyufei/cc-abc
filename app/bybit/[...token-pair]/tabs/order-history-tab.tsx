'use client';

import { Table } from '@medusajs/ui';
import { add, multiply } from 'safebase';

import { useState } from 'react';

import { OrderHistoryItem, useOrderHistory } from '@/lib/api/use-order-history';
import { getSymbolToken } from '@/lib/configs/token';

import { TimeRangeSelect } from './time-range-select';

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
  const [days, setDays] = useState<string | null>('7');
  const [dateRange, setDateRange] = useState<number[] | null>(null);

  const { data: orderHistoryResponse, isLoading, error } = useOrderHistory('', days, dateRange);

  function getFilledQuantityDisplay(orderItem: OrderHistoryItem) {
    const isMarketOrder = orderItem.order_type === 'Market';
    const [baseCoin] = getSymbolToken(orderItem.symbol);

    if (!isMarketOrder) {
      return `${orderItem.filled_quantity}/${orderItem.quantity} ${baseCoin}`;
    }

    const calcByBaseCoin = add(String(orderItem.cum_exec_qty), String(orderItem.leaves_qty));
    const isBaseCoin = Number(orderItem.quantity) === Number(calcByBaseCoin);

    if (isBaseCoin) {
      return `${orderItem.filled_quantity}/${orderItem.quantity} ${baseCoin}`;
    } else {
      return `${orderItem.filled_quantity}/-- ${baseCoin}`;
    }
  }

  function getFilledValueDisplay(orderItem: OrderHistoryItem) {
    const isMarketOrder = orderItem.order_type === 'Market';
    const [_, quoteCoin] = getSymbolToken(orderItem.symbol);

    if (!isMarketOrder) {
      return `${orderItem.cum_exec_value.toFixed(4)}/${Number(multiply(String(orderItem.quantity), String(orderItem.price))).toFixed(4)} ${quoteCoin}`;
    }

    const calcByQuoteCoin = add(String(orderItem.cum_exec_value), String(orderItem.leaves_value));
    const isQuoteCoin = Number(orderItem.quantity) === Number(calcByQuoteCoin);

    if (isQuoteCoin) {
      return `${orderItem.cum_exec_value.toFixed(4)}/${orderItem.quantity} ${quoteCoin}`;
    } else {
      return `${orderItem.cum_exec_value.toFixed(4)}/-- ${quoteCoin}`;
    }
  }

  /**
   * Transform API data to table format
   */
  const transformOrderData = (orderItem: OrderHistoryItem): OrderHistoryTableData => {
    const sideText = orderItem.side;
    const orderTypeText = orderItem.order_type;
    const avgPrice = (orderItem.avg_price || 0).toLocaleString();
    const isMarketOrder = orderTypeText === 'Market';
    const [_, quoteCoin] = getSymbolToken(orderItem.symbol);

    const orderPrice = isMarketOrder ? 'Market' : (orderItem.price || 0).toLocaleString();
    const priceDisplay = `${avgPrice}/${orderPrice}`;
    const filledQuantityDisplay = getFilledQuantityDisplay(orderItem);
    const orderTime = new Date(orderItem.created_at)
      .toLocaleString('sv-SE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      .replace('T', ' ');

    const filledValueDisplay = getFilledValueDisplay(orderItem);

    const tradingFees = `${orderItem.cum_exec_fee.toFixed(8)} ${quoteCoin}`;

    return {
      id: orderItem.id,
      market: orderItem.symbol,
      instrument: 'Spot', // Default value as not provided in API
      orderType: orderTypeText,
      direction: sideText,
      avgFilledPrice: priceDisplay,
      filledOrderQuantity: filledQuantityDisplay,
      orderTime: orderTime,
      orderId: orderItem.order_id,
      filledOrderValue: filledValueDisplay,
      orderStatus: orderItem.status.charAt(0).toUpperCase() + orderItem.status.slice(1),
      tradingFees: tradingFees,
      originalData: orderItem,
    };
  };

  // Process data for table
  const tableData = orderHistoryResponse?.map(transformOrderData) || [];

  return (
    <>
      <TimeRangeSelect
        days={days}
        setDays={setDays}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <div className="w-full h-full overflow-x-auto">
        <div className="w-full h-full" style={{ minWidth: '1500px' }}>
          <Table>
            <Table.Header className="sticky top-0 z-20 bg-ui-bg-subtle">
              <Table.Row>
                <Table.HeaderCell className="sticky left-0 z-10 bg-ui-bg-subtle border-r border-ui-border-base shadow-md whitespace-nowrap pl-3">
                  Market
                </Table.HeaderCell>
                <Table.HeaderCell className="whitespace-nowrap pl-3">Instrument</Table.HeaderCell>
                <Table.HeaderCell className="whitespace-nowrap pl-3">Order Type</Table.HeaderCell>
                <Table.HeaderCell className="whitespace-nowrap pl-3">Direction</Table.HeaderCell>
                <Table.HeaderCell className="whitespace-nowrap pl-3">
                  Avg. Filled Price/Order Price
                </Table.HeaderCell>
                <Table.HeaderCell className="whitespace-nowrap pl-3">
                  Filled/Order Quantity
                </Table.HeaderCell>
                <Table.HeaderCell className="whitespace-nowrap pl-3">Order Time</Table.HeaderCell>
                <Table.HeaderCell className="whitespace-nowrap pl-3">Order ID</Table.HeaderCell>
                <Table.HeaderCell className="whitespace-nowrap pl-3">
                  Filled/Order Value
                </Table.HeaderCell>
                <Table.HeaderCell className="whitespace-nowrap pl-3">Order Status</Table.HeaderCell>
                <Table.HeaderCell className="whitespace-nowrap pl-3">Trading Fees</Table.HeaderCell>
                {/* <Table.HeaderCell className="sticky right-0 z-20 bg-ui-bg-subtle border-l border-ui-border-base shadow-md whitespace-nowrap">
                Action
              </Table.HeaderCell> */}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {(!tableData?.length || isLoading || error) && (
                <Table.Row>
                  <td colSpan={11} className="text-center h-30">
                    {isLoading
                      ? 'Loading order history...'
                      : error
                        ? 'Failed to load order history'
                        : 'No order history found'}
                  </td>
                </Table.Row>
              )}
              {tableData.map((item: OrderHistoryTableData) => (
                <Table.Row key={item.id}>
                  <Table.Cell className="sticky left-0 z-10 bg-ui-bg-base border-r border-ui-border-base sticky-left-header-shadow whitespace-nowrap pl-3">
                    {item.market}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap pl-3">{item.instrument}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap pl-3">{item.orderType}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap pl-3">
                    <span className={item.direction === 'Buy' ? 'text-green-600' : 'text-red-600'}>
                      {item.direction}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap pl-3">{item.avgFilledPrice}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap pl-3">
                    {item.filledOrderQuantity}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap pl-3">{item.orderTime}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap pl-3">{item.orderId}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap pl-3">
                    {item.filledOrderValue}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap pl-3">
                    <span
                      className={item.orderStatus === 'Filled' ? 'text-green-600' : 'text-gray-600'}
                    >
                      {item.orderStatus}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap pl-3">{item.tradingFees}</Table.Cell>
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
    </>
  );
}
