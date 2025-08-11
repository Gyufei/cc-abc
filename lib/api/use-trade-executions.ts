import { useQuery } from '@tanstack/react-query';

import { ApiPath } from '@/lib/api/api-path';
import { Fetcher } from '@/lib/fetcher';
import { useCurrentApiKey } from '@/lib/hooks/use-current-api-key';
import { useAppStore } from '@/lib/store';

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

export function useTradeExecutions(
  symbol: string,
  days: string | null,
  dateRange: number[] | null
) {
  const { user } = useAppStore();
  const { data: currentApiKey } = useCurrentApiKey();

  const query = useQuery({
    queryKey: ['trade-executions', currentApiKey?.api_key, symbol, days, dateRange],
    queryFn: async (): Promise<TradeExecutionItem[]> => {
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
        ...(dateRange && dateRange[0] && dateRange[1] && {
          start_time: dateRange[0].toString(),
          end_time: dateRange[1].toString(),
        }),
      });

      const url = `${ApiPath.tradingExecutions}?${params.toString()}`;

      const response = await Fetcher<TradeExecutionItem[]>(url, {
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
