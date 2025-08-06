import { toast } from '@medusajs/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Fetcher } from '../fetcher';
import { useCurrentApiKey } from '../hooks/use-current-api-key';
import { useUser } from '../store';
import { ErrorRes } from '../types/common';
import { ApiPath } from './api-path';

export interface TradingOrderRequest {
  api_key: string;
  category: string;
  symbol: string;
  side: string;
  order_type: string;
  qty: string;
  market_unit?: string;

  tp_order_type?: string;
  sl_order_type?: string;
  tp_limit_price?: string;
  sl_limit_price?: string;
  time_in_force?: string;
  price?: string;
  reduce_only?: boolean;
  trigger_price?: string;
  take_profit?: string;
  stop_loss?: string;
  close_on_trigger?: boolean;
  order_filter?: string;
}

export interface TradingOrderResponse {
  order_id: string;
  status: string;
}

export function useTradingOrders() {
  const user = useUser();
  const { data: currentApiKeyObj } = useCurrentApiKey();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (orderData: Omit<TradingOrderRequest, 'api_key'>) => {
      try {
        if (!user.token || !user.user_id) {
          throw new Error('User not login');
        }

        if (!currentApiKeyObj?.api_key) {
          throw new Error('No api key selected');
        }

        const params = {
          ...orderData,
          api_key: currentApiKeyObj?.api_key,
        };

        const res = await Fetcher<TradingOrderResponse>(ApiPath.tradingOrder, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
            'X-User-ID': user.user_id,
          },
          body: JSON.stringify(params),
        });

        let errorRes: ErrorRes | null = null;
        if ('code' in res) {
          errorRes = res as unknown as ErrorRes;
        }

        if (errorRes && errorRes?.code !== 200) {
          throw new Error(errorRes?.msg || 'Unknown error');
        }

        return res;
      } catch (e) {
        if (e instanceof Error) {
          const errorMessage =
            'message' in e ? (e as { message: string }).message : 'Unknown error';
          throw new Error(errorMessage);
        }

        throw new Error('Unknown error');
      }
    },

    onSuccess: (data: TradingOrderResponse | undefined) => {
      if (!data) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ['open-orders', 'order-history', 'trade-executions'],
      });

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
