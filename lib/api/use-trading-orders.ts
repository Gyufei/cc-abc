import { toast } from '@medusajs/ui';
import { useMutation } from '@tanstack/react-query';

import { Fetcher } from '../fetcher';
import { useAppStore } from '../store';
import { ApiPath } from './api-path';

export interface TradingOrderRequest {
  api_key: string;
  category: string;
  symbol: string;
  side: string;
  order_type: string;
  qty: string;
  time_in_force: string;
  reduce_only: boolean;
  trigger_price: string;
  // take_profit?: string;
  // stop_loss?: string;
  // tp_order_type?: string;
  // sl_order_type?: string;
  close_on_trigger: boolean;
  market_unit: string;
  order_filter: string;
}

export interface TradingOrderResponse {
  order_id: string;
  status: string;
}

// 交易订单 API 函数
async function tradingOrderApi(orderData: TradingOrderRequest): Promise<TradingOrderResponse> {
  const { user } = useAppStore.getState();

  if (!user.token || !user.user_id) {
    throw new Error('用户未登录');
  }

  return Fetcher<TradingOrderResponse>(ApiPath.tradingOrder, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`,
      'X-User-ID': user.user_id,
    },
    body: JSON.stringify(orderData),
  });
}

export function useTradingOrders() {
  const mutation = useMutation({
    mutationFn: tradingOrderApi,
    onSuccess: (data: TradingOrderResponse) => {
      toast.success('Order created successfully', {
        description: `Order ID: ${data.order_id}`,
      });
    },
    onError: (error: Error) => {
      toast.error('Order creation failed', {
        description: error.message,
      });
    },
  });

  return mutation;
}
