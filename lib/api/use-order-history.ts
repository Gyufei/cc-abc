import { useQuery } from '@tanstack/react-query';

import { Fetcher as _Fetcher } from '../fetcher';
import { useCurrentApiKey } from '../hooks/use-current-api-key';
import { useAppStore } from '../store';
import { ApiPath as _ApiPath } from './api-path';

// Order history data interface matching the API response
export interface OrderHistoryItem {
  id: string;
  user_id: string;
  symbol: string;
  side: string;
  order_type: string;
  quantity: number;
  price: number;
  filled_quantity: number;
  status: string;
  created_at: string;
  updated_at: string;
  order_id: string;
  order_link_id: string;
  avg_price: number;
  leaves_qty: number;
  cum_exec_qty: number;
  cum_exec_value: number;
  leaves_value: number;
  cum_exec_fee: number;
  time_in_force: string;
  stop_order_type: string;
  trigger_price: number;
  take_profit: number;
  stop_loss: number;
  reduce_only: boolean;
  close_on_trigger: boolean;
}

export interface OrderHistoryResponse {
  code: number;
  msg: string;
  data: OrderHistoryItem[];
}

/**
 * Fetch order history from API
 * @param apiKey - API key for authentication
 * @param symbol - Trading symbol (e.g., BTCUSDT)
 * @param days - Number of days to fetch (optional)
 */
async function fetchOrderHistory(
  apiKey: string,
  symbol: string,
  days?: number
): Promise<OrderHistoryResponse> {
  const { user } = useAppStore.getState();

  if (!user.token || !user.user_id) {
    throw new Error('用户未登录');
  }

  if (!apiKey) {
    throw new Error('No api key selected');
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    symbol: symbol,
  });

  if (days) {
    params.append('days', days.toString());
  }

  // Mock data response since the API service is not ready yet
  const mockResponse: OrderHistoryResponse = {
    code: 200,
    msg: 'success',
    data: [
      {
        id: '2005230740144657664',
        user_id: 'e22128f7-c5db-4e5a-bdef-9dca78179132',
        symbol: 'BTCUSDT',
        side: 'sell',
        order_type: 'market',
        quantity: 0.003,
        price: 0,
        filled_quantity: 0.003,
        status: 'filled',
        created_at: '2025-07-29T08:35:31.918Z',
        updated_at: '2025-07-29T08:35:31.922Z',
        order_id: '2005230740144657664',
        order_link_id: 'd4406f2f-9bfa-495a-990e-15391aee593a',
        avg_price: 130149.81,
        leaves_qty: 0,
        cum_exec_qty: 0.003,
        cum_exec_value: 390.44944158,
        leaves_value: 0,
        cum_exec_fee: 0.39044944158,
        time_in_force: 'IOC',
        stop_order_type: '',
        trigger_price: 0,
        take_profit: 0,
        stop_loss: 0,
        reduce_only: false,
        close_on_trigger: false,
      },
    ],
  };

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return mockResponse;

  // TODO: Replace with real API call when service is ready
  // const url = `${ApiPath.tradingOrderHistory}?${params.toString()}`;

  // return Fetcher<OrderHistoryResponse>(url, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${user.token}`,
  //     'X-User-ID': user.user_id,
  //   },
  // });
}

/**
 * Hook to fetch order history data
 * @param apiKey - API key for authentication
 * @param symbol - Trading symbol
 * @param days - Number of days to fetch
 */
export function useOrderHistory(symbol: string, days?: number) {
  const { data: currentApiKeyObj } = useCurrentApiKey();
  const apiKey = currentApiKeyObj?.api_key;

  return useQuery({
    queryKey: ['orderHistory', apiKey, symbol, days],
    queryFn: () => fetchOrderHistory(apiKey || '', symbol, days),
    enabled: !!apiKey && !!symbol,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
}
