'use client';

import { Table } from '@medusajs/ui';

/**
 * TradeHistoryTab component displays trade history table
 * Matches the design with columns: Market, Instrument, Order Type, Direction, Filled Value, Filled Pri, Index Price
 */
export function TradeHistoryTab() {
  // Sample data matching the design
  const tradeHistory = [
    {
      market: 'BTCUSDT',
      instrument: 'USDT perpetuals',
      orderType: 'Limit',
      direction: 'Open Long',
      filledValue: '199,917.7872 USDT',
      filledPrice: '118,575.',
      indexPrice: '--'
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
              Filled Value
            </Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              Filled Pri
            </Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-3 text-left smm-text text-ui-fg-muted font-medium">
              Index Price
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tradeHistory.map((trade, index) => (
            <Table.Row key={index} className="border-b border-ui-border-base hover:bg-ui-bg-subtle-hover">
              <Table.Cell className="px-4 py-3 smm-text text-ui-fg-base">
                {trade.market}
              </Table.Cell>
              <Table.Cell className="px-4 py-3 smm-text text-ui-fg-base">
                {trade.instrument}
              </Table.Cell>
              <Table.Cell className="px-4 py-3 smm-text text-ui-fg-base">
                {trade.orderType}
              </Table.Cell>
              <Table.Cell className="px-4 py-3 smm-text">
                <span className="text-ui-green">
                  {trade.direction}
                </span>
              </Table.Cell>
              <Table.Cell className="px-4 py-3 smm-text text-ui-fg-base">
                {trade.filledValue}
              </Table.Cell>
              <Table.Cell className="px-4 py-3 smm-text text-ui-fg-base">
                {trade.filledPrice}
              </Table.Cell>
              <Table.Cell className="px-4 py-3 smm-text text-ui-fg-base">
                {trade.indexPrice}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}