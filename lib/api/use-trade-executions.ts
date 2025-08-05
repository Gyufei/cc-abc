import { useQuery } from '@tanstack/react-query';
import { Fetcher as _Fetcher } from '../fetcher';
import { useAppStore as _useAppStore } from '../store';
import { ApiPath as _ApiPath } from './api-path';

// Trade execution data interface matching the API response
export interface TradeExecutionItem {
  id: string;
  user_id: string;
  order_id: string;
  order_link_id: string;
  symbol: string;
  side: string;
  order_type: string;
  exec_qty: number;
  exec_price: number;
  exec_value: number;
  exec_fee: number;
  exec_time: string;
  is_maker: boolean;
  fee_rate: number;
  fee_currency: string;
  exec_type: string;
  closed_size: number | null;
  mark_price: number | null;
  index_price: number | null;
  underlying_price: string;
  leaves_qty: string;
  order_price: number;
  order_qty: number;
  stop_order_type: string;
  trade_iv: string;
  mark_iv: string;
  block_trade_id: string;
  category: string | null;
  seq: number;
  extra_fees: string;
}

export interface TradeExecutionResponse {
  code: number;
  msg: string;
  data: TradeExecutionItem[];
}

/**
 * Fetch trade executions from API (currently returns mock data)
 * @param apiKey - API key for authentication
 * @param symbol - Trading symbol (e.g., BTCUSDT)
 * @param days - Number of days to fetch (optional)
 */
async function fetchTradeExecutions(
  _apiKey: string,
  _symbol: string,
  _days?: number
): Promise<TradeExecutionResponse> {
  // Mock data response since the API service is not ready yet
  const mockResponse: TradeExecutionResponse = {
    code: 200,
    msg: "success",
    data: [
      {
        id: "2100000000145760666",
        user_id: "63e486e7-64d8-4038-adc4-f2a403756d4e",
        order_id: "2006659873340921088",
        order_link_id: "3c14265c-38d2-47f7-9631-038bf10a6107",
        symbol: "BTCUSDT",
        side: "Buy",
        order_type: "Limit",
        exec_qty: 0.004008,
        exec_price: 114350.6,
        exec_value: 458.3172048,
        exec_fee: 0.000004008,
        exec_time: "2025-07-31T15:12:02.610Z",
        is_maker: true,
        fee_rate: 0.001,
        fee_currency: "BTC",
        exec_type: "Trade",
        closed_size: null,
        mark_price: null,
        index_price: null,
        underlying_price: "",
        leaves_qty: "0",
        order_price: 114350.6,
        order_qty: 0.004008,
        stop_order_type: "",
        trade_iv: "",
        mark_iv: "",
        block_trade_id: "",
        category: null,
        seq: 1783041258,
        extra_fees: ""
      }
    ]
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockResponse;

  // TODO: Replace with real API call when service is ready
  // const { user } = useAppStore.getState();
  // if (!user.token || !user.user_id) {
  //   throw new Error('用户未登录');
  // }
  // const params = new URLSearchParams({
  //   api_key: apiKey,
  //   symbol: symbol,
  // });
  // if (days) {
  //   params.append('days', days.toString());
  // }
  // const url = `${ApiPath.tradingExecutions}?${params.toString()}`;
  // return Fetcher<TradeExecutionResponse>(url, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${user.token}`,
  //     'X-User-ID': user.user_id,
  //   },
  // });
}

/**
 * Hook to fetch trade execution data
 * @param apiKey - API key for authentication
 * @param symbol - Trading symbol
 * @param days - Number of days to fetch
 */
export function useTradeExecutions(apiKey: string, symbol: string, days?: number) {
  return useQuery({
    queryKey: ['tradeExecutions', apiKey, symbol, days],
    queryFn: () => fetchTradeExecutions(apiKey, symbol, days),
    enabled: !!apiKey && !!symbol,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
}