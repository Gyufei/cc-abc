import { getMarketInfoData } from './use-market-info';

export async function getTokensPrice(symbols: [string, string][]) {
  const promises = symbols.map(([baseCoin, quoteCoin]) => getMarketInfoData(baseCoin, quoteCoin));

  const results = await Promise.allSettled(promises);

  const priceMap = results.reduce(
    (acc: Record<string, number>, result) => {
      if (result.status === 'fulfilled' && result.value) {
        const curr = result.value;
        const marketSymbol = curr.symbol; // like BTCUSDT

        for (const [baseCoin, quoteCoin] of symbols) {
          if (marketSymbol.startsWith(baseCoin) && marketSymbol.endsWith(quoteCoin)) {
            acc[`${baseCoin}`] = curr.price;
            break;
          }
        }
      }
      return acc;
    },
    {} as Record<string, number>
  );

  return priceMap;
}
