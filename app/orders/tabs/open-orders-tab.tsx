'use client';

import { Table } from '@medusajs/ui';

/**
 * OpenOrdersTab component displays open orders table
 * Matches the design with columns: Market, Instrument, Order Type, Direction, Order Price, Filled/Order Quantity, Order, Action
 */
export function OpenOrdersTab() {
  // Sample data matching the design
  const openOrders = [
    {
      market: 'BTC/USDT',
      instrument: 'Spot',
      orderType: 'Limit',
      direction: 'Buy',
      orderPrice: '114,350.60',
      filledOrderQuantity: '0.0000000/0.004008 BTC',
      order: '458.3',
      action: 'Cancel'
    }
  ];

  return (
    <div className="w-full h-full">
      <Table>
        <Table.Header className="bg-ui-bg-subtle">
          <Table.Row className="border-b border-ui-border-base">
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              Market
            </Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              Instrument
            </Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              Order Type
            </Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              Direction
            </Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              Order Price
            </Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              Filled/Order Quantity
            </Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              Order
            </Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              Action
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {openOrders.map((order, index) => (
            <Table.Row key={index} className="border-b border-ui-border-base hover:bg-ui-bg-subtle-hover">
              <Table.Cell className="px-4 py-3 smm-text text-ui-fg-base">
                {order.market}
              </Table.Cell>
              <Table.Cell className="px-4 py-3 smm-text text-ui-fg-base">
                {order.instrument}
              </Table.Cell>
              <Table.Cell className="px-4 py-3 smm-text text-ui-fg-base">
                {order.orderType}
              </Table.Cell>
              <Table.Cell className="px-4 py-3 smm-text">
                <span className={order.direction === 'Buy' ? 'text-ui-green' : 'text-ui-red'}>
                  {order.direction}
                </span>
              </Table.Cell>
              <Table.Cell className="px-4 py-3 smm-text text-ui-fg-base">
                {order.orderPrice}
              </Table.Cell>
              <Table.Cell className="px-4 py-3 smm-text text-ui-fg-base">
                {order.filledOrderQuantity}
              </Table.Cell>
              <Table.Cell className="px-4 py-3 smm-text text-ui-fg-base">
                {order.order}
              </Table.Cell>
              <Table.Cell className="px-4 py-3">
                <button className="smm-text text-ui-fg-muted hover:text-ui-fg-base transition-colors">
                  {order.action}
                </button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}