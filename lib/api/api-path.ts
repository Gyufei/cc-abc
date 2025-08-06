export const isPreview = process.env.NEXT_PUBLIC_IS_PREVIEW === '1';
export const isProduction = process.env.NODE_ENV === 'production' && !isPreview;

const ProdHost = 'https://screener.anymm.com';
const DevHost = 'https://preview-screener.anymm.com';

export const ApiHost = isProduction ? ProdHost : DevHost;

export const ApiPath = {
  publicKey: `${ApiHost}/api/v1/auth/public-key`,
  register: `${ApiHost}/api/v1/auth/register`,
  login: `${ApiHost}/api/v1/auth/login`,
  apiKeys: `${ApiHost}/api/v1/api-bindings`,
  tradingOrder: `${ApiHost}/api/v1/trading/orders`,
  tradingOrders: `${ApiHost}/api/v1/trading/orders`,
  tradingSymbols: `${ApiHost}/api/v1/trading/symbols`,
  tradingOrderHistory: `${ApiHost}/api/v1/trading/orders/history`,
  tradingExecutions: `${ApiHost}/api/v1/trading/executions`,
  tradingAssets: `${ApiHost}/api/v1/trading/assets`,
  tradingMarket: `${ApiHost}/api/v1/trading/market`,
  cancelOrder: `${ApiHost}/api/v1/trading/orders/cancel`,
  marketPrices: `${ApiHost}/api/v1/market/prices`,
  currentSymbol: `${ApiHost}/api/v1/trading/current-symbol`,
  checkUsername: `${ApiHost}/api/v1/auth/check-username`,
};
