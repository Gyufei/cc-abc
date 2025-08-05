export type SIDE = 'buy' | 'sell';

export type TRADE_TYPE =
  | 'Market'
  | 'Limit'
  | 'TP/SL'
  | 'Conditional'
  | 'OCO'
  | 'Trailing Stop'
  | 'Iceberg'
  | 'TWAP'
  | 'Scaled Order';

export type CANCEL_TYPE = 'Good-Till-Cancel' | 'Immediate-Or-Cancel' | 'Fill-Or-Kill';

export interface TokenPair {
  symbol: string;
  display_name: string;
}
