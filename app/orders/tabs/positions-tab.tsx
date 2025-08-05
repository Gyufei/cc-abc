'use client';

import { Table } from '@table-library/react-table-library/table';
import { Header, HeaderRow, HeaderCell, Body, Row, Cell } from '@table-library/react-table-library/table';
import { useTheme } from '@table-library/react-table-library/theme';

// Type definition for position data
interface PositionData {
  id: string;
  contracts: string;
  crossPercent: string;
  qty: string;
  value: string;
  entry: string;
  markPrice: string;
  liqPrice: string;
  im: string;
  mm: string;
  closeBy: string;
}

/**
 * PositionsTab component displays positions table
 * Matches the design with columns: Contracts, Qty, Value, Entry, Mark Price, Liq. Price, IM, MM, Close By
 */
export function PositionsTab() {
  // Sample data matching the design - converted to react-table-library format
  const data = {
    nodes: [
      {
        id: '1',
        contracts: 'BTCUSDT',
        crossPercent: 'Cross 10.00x',
        qty: '686 BTC',
        value: '199,917.78 USDT',
        entry: '118,575.20',
        markPrice: '113,539.60',
        liqPrice: '61,099.29',
        im: '20,090.7380 USDT ≈20,090.73 USD',
        mm: '1,098.5482 USDT ≈1,098.54 USD',
        closeBy: 'Limit Market'
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
        {(tableList: PositionData[]) => (
          <>
            <Header>
              <HeaderRow>
                <HeaderCell>Contracts</HeaderCell>
                <HeaderCell>Qty</HeaderCell>
                <HeaderCell>Value</HeaderCell>
                <HeaderCell>Entry</HeaderCell>
                <HeaderCell>Mark Price</HeaderCell>
                <HeaderCell>Liq. Price</HeaderCell>
                <HeaderCell>IM</HeaderCell>
                <HeaderCell>MM</HeaderCell>
                <HeaderCell>Close By</HeaderCell>
              </HeaderRow>
            </Header>
            <Body>
              {tableList.map((item: PositionData) => (
                <Row key={item.id} item={item}>
                  <Cell>
                    <div className="flex flex-col">
                      <span className="smm-text text-ui-fg-base">{item.contracts}</span>
                      <span className="text-xs text-ui-green">{item.crossPercent}</span>
                    </div>
                  </Cell>
                  <Cell>
                    <span className="smm-text text-ui-fg-base">{item.qty}</span>
                  </Cell>
                  <Cell>
                    <span className="smm-text text-ui-fg-base">{item.value}</span>
                  </Cell>
                  <Cell>
                    <span className="smm-text text-ui-fg-base">{item.entry}</span>
                  </Cell>
                  <Cell>
                    <span className="smm-text text-ui-fg-base">{item.markPrice}</span>
                  </Cell>
                  <Cell>
                    <span className="smm-text text-orange-500">{item.liqPrice}</span>
                  </Cell>
                  <Cell>
                    <span className="smm-text text-ui-fg-base">{item.im}</span>
                  </Cell>
                  <Cell>
                    <span className="smm-text text-ui-fg-base">{item.mm}</span>
                  </Cell>
                  <Cell>
                    <div className="flex gap-2">
                      <button className="smm-text text-ui-fg-muted hover:text-ui-fg-base transition-colors border border-ui-border-base px-2 py-1 rounded">
                        Limit
                      </button>
                      <button className="smm-text text-ui-fg-muted hover:text-ui-fg-base transition-colors border border-ui-border-base px-2 py-1 rounded">
                        Market
                      </button>
                    </div>
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