'use client';

import { Table } from '@table-library/react-table-library/table';
import { Header, HeaderRow, HeaderCell, Body, Row, Cell } from '@table-library/react-table-library/table';
import { useTheme } from '@table-library/react-table-library/theme';

// Type definition for open order data
interface OpenOrderData {
  id: string;
  market: string;
  instrument: string;
  orderType: string;
  direction: string;
  orderPrice: string;
  filledOrderQuantity: string;
  order: string;
  action: string;
}

/**
 * OpenOrdersTab component displays open orders table
 * Matches the design with columns: Market, Instrument, Order Type, Direction, Order Price, Filled/Order Quantity, Order, Action
 */
export function OpenOrdersTab() {
  // Sample data matching the design - converted to react-table-library format
  const data = {
    nodes: [
      {
        id: '1',
        market: 'BTC/USDT',
        instrument: 'Spot',
        orderType: 'Limit',
        direction: 'Buy',
        orderPrice: '114,350.60',
        filledOrderQuantity: '0.0000000/0.004008 BTC',
        order: '458.3',
        action: 'Cancel'
      }
    ]
  };

  // Custom theme to match existing design with sticky columns
  const theme = useTheme({
    Table: `
      --data-table-library_grid-template-columns: 120px 140px 120px 120px 140px 120px 120px 100px;
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
      
      &:last-child {
        position: sticky;
        right: 0;
        z-index: 10;
        background-color: var(--ui-bg-subtle);
        box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
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
      
      &:last-child {
        position: sticky;
        right: 0;
        z-index: 5;
        background-color: var(--ui-bg-base);
        box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
      }
      
      &:first-child:hover,
       &:last-child:hover {
         background-color: var(--ui-bg-subtle-hover);
       }
    `
  });

  return (
    <div className="w-full h-full overflow-x-auto">
      <Table data={data} theme={theme}>
        {(tableList: OpenOrderData[]) => (
          <>
            <Header>
              <HeaderRow>
                <HeaderCell>Market</HeaderCell>
                <HeaderCell>Instrument</HeaderCell>
                <HeaderCell>Order Type</HeaderCell>
                <HeaderCell>Direction</HeaderCell>
                <HeaderCell>Order Price</HeaderCell>
                <HeaderCell>Filled/Order Quantity</HeaderCell>
                <HeaderCell>Order</HeaderCell>
                <HeaderCell>Action</HeaderCell>
              </HeaderRow>
            </Header>
            <Body>
              {tableList.map((item: OpenOrderData) => (
                <Row key={item.id} item={item}>
                  <Cell>
                    <span className="smm-text text-ui-fg-base">{item.market}</span>
                  </Cell>
                  <Cell>
                    <span className="smm-text text-ui-fg-base">{item.instrument}</span>
                  </Cell>
                  <Cell>
                    <span className="smm-text text-ui-fg-base">{item.orderType}</span>
                  </Cell>
                  <Cell>
                    <span className={item.direction === 'Buy' ? 'text-ui-green' : 'text-ui-red'}>
                      {item.direction}
                    </span>
                  </Cell>
                  <Cell>
                    <span className="smm-text text-ui-fg-base">{item.orderPrice}</span>
                  </Cell>
                  <Cell>
                    <span className="smm-text text-ui-fg-base">{item.filledOrderQuantity}</span>
                  </Cell>
                  <Cell>
                    <span className="smm-text text-ui-fg-base">{item.order}</span>
                  </Cell>
                  <Cell>
                    <button className="smm-text text-ui-fg-muted hover:text-ui-fg-base transition-colors border border-ui-border-base px-2 py-1 rounded">
                      {item.action}
                    </button>
                  </Cell>
                </Row>
              ))}
            </Body>
          </>
        )}
      </Table>
    </div>
  );
}