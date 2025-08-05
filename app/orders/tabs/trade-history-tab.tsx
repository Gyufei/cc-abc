'use client';

import { Table } from '@table-library/react-table-library/table';
import { Header, HeaderRow, HeaderCell, Body, Row, Cell } from '@table-library/react-table-library/table';
import { useTheme } from '@table-library/react-table-library/theme';

// Type definition for trade history data
interface TradeHistoryData {
  id: string;
  market: string;
  instrument: string;
  orderType: string;
  direction: string;
  filledValue: string;
  filledPrice: string;
  indexPrice: string;
}

/**
 * TradeHistoryTab component displays trade history table
 * Matches the design with columns: Market, Instrument, Order Type, Direction, Filled Value, Filled Pri, Index Price
 */
export function TradeHistoryTab() {
  // Sample data matching the design - converted to react-table-library format
  const data = {
    nodes: [
      {
        id: '1',
        market: 'BTCUSDT',
        instrument: 'USDT perpetuals',
        orderType: 'Limit',
        direction: 'Open Long',
        filledValue: '199,917.7872 USDT',
        filledPrice: '118,575.',
        indexPrice: '--'
      }
    ]
  };

  // Custom theme to match existing design with sticky first column
  const theme = useTheme({
    Table: `
      --data-table-library_grid-template-columns: 120px 140px 120px 120px 180px 120px 120px;
      border-collapse: collapse;
      width: 100%;
      background-color: var(--ui-bg-base);
      overflow-x: auto;
      position: relative;
    `,
    Header: `
      background-color: var(--ui-bg-subtle);
    `,
    HeaderRow: `
      border-bottom: 1px solid var(--ui-border-base);
    `,
    HeaderCell: `
      padding: 12px 16px;
      text-align: left;
      font-size: 14px;
      color: var(--ui-fg-muted);
      font-weight: 500;
      background-color: var(--ui-bg-subtle);
      
      &:first-child {
        position: sticky;
        left: 0;
        z-index: 10;
        background-color: var(--ui-bg-subtle);
        box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
      }
    `,
    Row: `
      border-bottom: 1px solid var(--ui-border-base);
      background-color: var(--ui-bg-base);
      &:hover {
        background-color: var(--ui-bg-subtle-hover);
      }
    `,
    Cell: `
      padding: 12px 16px;
      font-size: 14px;
      color: var(--ui-fg-base);
      background-color: var(--ui-bg-base);
      
      &:first-child {
        position: sticky;
        left: 0;
        z-index: 5;
        background-color: var(--ui-bg-base);
        box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
      }
      
      &:first-child:hover {
         background-color: var(--ui-bg-subtle-hover);
       }
    `
  });

  return (
    <div className="w-full h-full overflow-x-auto">
      <Table data={data} theme={theme}>
        {(tableList: TradeHistoryData[]) => (
          <>
            <Header>
              <HeaderRow>
                <HeaderCell>Market</HeaderCell>
                <HeaderCell>Instrument</HeaderCell>
                <HeaderCell>Order Type</HeaderCell>
                <HeaderCell>Direction</HeaderCell>
                <HeaderCell>Filled Value</HeaderCell>
                <HeaderCell>Filled Pri</HeaderCell>
                <HeaderCell>Index Price</HeaderCell>
              </HeaderRow>
            </Header>
            <Body>
              {tableList.map((item: TradeHistoryData) => (
                <Row key={item.id} item={item}>
                  <Cell>{item.market}</Cell>
                  <Cell>{item.instrument}</Cell>
                  <Cell>{item.orderType}</Cell>
                  <Cell>
                    <span className="text-ui-green">
                      {item.direction}
                    </span>
                  </Cell>
                  <Cell>{item.filledValue}</Cell>
                  <Cell>{item.filledPrice}</Cell>
                  <Cell>{item.indexPrice}</Cell>
                </Row>
              ))}
            </Body>
          </>
        )}
      </Table>
    </div>
  );
}