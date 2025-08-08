import { useQuery } from '@tanstack/react-query';

import { ApiPath } from '@/lib/api/api-path';
import { Fetcher } from '@/lib/fetcher';
import { useCurrentApiKey } from '@/lib/hooks/use-current-api-key';
import { useAppStore } from '@/lib/store';

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

export function useOrderHistory(
  symbol?: string,
  days?: string | null,
  dateRange?: number[] | null
) {
  const { user } = useAppStore();
  const { data: currentApiKey } = useCurrentApiKey();

  const query = useQuery({
    queryKey: ['order-history', currentApiKey?.api_key, symbol, days, dateRange],
    queryFn: async (): Promise<OrderHistoryItem[]> => {
      if (!user.token || !user.user_id) {
        throw new Error('user not logged in');
      }

      if (!currentApiKey?.api_key) {
        throw new Error('no api key selected');
      }

      const params = new URLSearchParams({
        api_key: currentApiKey.api_key,
        ...(symbol && { symbol }),
        ...(days && { days: days.toString() }),
        ...(dateRange && {
          start_time: dateRange[0].toString(),
          end_time: dateRange[1].toString(),
        }),
      });

      const url = `${ApiPath.tradingOrderHistory}?${params.toString()}`;

      const response = await Fetcher<OrderHistoryItem[]>(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
          'X-User-ID': user.user_id || '',
        },
      });

      return response;
    },

    enabled: !!user.token && !!user.user_id && !!currentApiKey?.api_key,
  });

  return query;
}
