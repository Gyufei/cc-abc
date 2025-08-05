'use client';

import { Table } from '@medusajs/ui';

/**
 * OrderHistoryTab component displays order history table
 * Matches the design with columns: Market, Instrument, Order Type, Direction, Avg. Filled Price/Order Price, Filled/O, Action
 */
export function OrderHistoryTab() {
  // Sample data matching the design
  const orderHistory = [
    {
      market: 'BTCUSDT',
      instrument: 'USDT Pperpetuals',
      orderType: 'Limit',
      direction: 'Open Long',
      avgFilledPrice: '118,575.20/118,575.20',
      filled: '1.686/1',
      action: 'Details'
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
              Avg. Filled Price/Order Price
            </Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              Filled/O
            </Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              Action
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {orderHistory.map((order, index) => (
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
                <span className="text-ui-green">
                  {order.direction}
                </span>
              </Table.Cell>
              <Table.Cell className="px-4 py-3 smm-text text-ui-fg-base">
                {order.avgFilledPrice}
              </Table.Cell>
              <Table.Cell className="px-4 py-3 smm-text text-ui-fg-base">
                {order.filled}
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