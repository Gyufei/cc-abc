import { useQuery } from '@tanstack/react-query';

import { ReactElement } from 'react';

import { ApiPath } from '@/lib/api/api-path';
import { Fetcher } from '@/lib/fetcher';
import { useCurrentApiKey } from '@/lib/hooks/use-current-api-key';
import { useAppStore } from '@/lib/store';

// Interface for open order item from API
export interface OpenOrderItem {
  id: string;
  user_id: string;
  symbol: string;
  side: 'buy' | 'sell';
  order_type: 'limit' | 'market';
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
  cum_exec_fee: number;
  time_in_force: string;
  stop_order_type: string;
  leaves_value: number;
  trigger_price: number;
  take_profit: number;
  stop_loss: number;
  reduce_only: boolean;
  close_on_trigger: boolean;
}

// Interface for table display data
export interface OpenOrderTableData {
  id: string;
  market: string;
  instrument: string;
  orderType: string;
  direction: string;
  orderPrice: string | ReactElement;
  filledOrderQuantity: string;
  order: string;
  tpSl: string | ReactElement;
  tradeType: string;
  orderTime: string;
  orderId: string;
  reduceOnly: string;
  orderLinkId: string;
  symbol: string;
  status: string; // Add status field for filtering
}

export function useOpenOrders(symbol?: string) {
  const { user } = useAppStore();
  const { data: currentApiKey } = useCurrentApiKey();

  const query = useQuery({
    queryKey: ['open-orders', currentApiKey?.api_key, symbol],

    queryFn: async (): Promise<OpenOrderItem[]> => {
      if (!user.token || !user.user_id) {
        throw new Error('user not logged in');
      }

      if (!currentApiKey?.api_key) {
        throw new Error('no api key selected');
      }

      // Real API call implementation (commented out for now)
      const params = new URLSearchParams({
        api_key: currentApiKey.api_key,
        ...(symbol && { symbol }),
      });

      const url = `${ApiPath.tradingOrders}?${params.toString()}`;

      const res = await Fetcher<OpenOrderItem[]>(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
          'X-User-ID': user.user_id || '',
        },
      });

      return res;
    },

    enabled: !!user.token && !!user.user_id && !!currentApiKey?.api_key,
  });

  return query;
}
