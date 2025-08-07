import { getSymbolToken } from '../configs/token';
import { getMarketInfoData } from './use-market-info';

export async function getTokensPrice(symbols: [string, string][]) {
  const promises = symbols.map(([baseCoin, quoteCoin]) => getMarketInfoData(baseCoin, quoteCoin));

  const results = await Promise.allSettled(promises);

  const priceMap = results.reduce(
    (acc: Record<string, number>, result) => {
      if (result.status === 'fulfilled' && result.value) {
        const curr = result.value;
        const marketSymbol = curr.symbol; // like BTCUSDT
        const [bCoin] = getSymbolToken(marketSymbol);
        if (bCoin) {
          acc[`${bCoin}`] = curr.price;
        }
      }
      return acc;
    },
    {} as Record<string, number>
  );

  return priceMap;
}
