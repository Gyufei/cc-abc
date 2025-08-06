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

export type TIME_IN_FORCE_TYPE = 'PostOnly' | 'GTC' | 'IOC' | 'FOK';

export interface TokenPair {
  symbol: string;
  display_name: string;
}
