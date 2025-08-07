import { isProduction } from '../api/api-path';

export const G_TOKEN_PAIRS = isProduction
  ? ([
      ['BTC', 'USDT'],
      ['ETH', 'USDT'],
      ['MAK', 'USDT'],
      ['MIA', 'USDT'],
    ] as [string, string][])
  : ([
      ['BTC', 'USDT'],
      ['ETH', 'USDT'],
    ] as [string, string][]);

export function getSymbolToken(symbol: string): [string, string] {
  const pair = G_TOKEN_PAIRS.find((pair) => symbol.startsWith(pair[0]) && symbol.endsWith(pair[1]));

  if (!pair) {
    return ['', ''];
  }

  return pair;
}
