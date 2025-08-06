import { useQuery } from '@tanstack/react-query';

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
  trigger_price: number;
  take_profit: number;
  stop_loss: number;
  reduce_only: boolean;
  close_on_trigger: boolean;
}

// Interface for API response
export interface OpenOrdersResponse {
  data: OpenOrderItem[];
}

// Interface for table display data
export interface OpenOrderTableData {
  id: string;
  market: string;
  instrument: string;
  orderType: string;
  direction: string;
  orderPrice: string;
  filledOrderQuantity: string;
  order: string;
  tpSl: string;
  tradeType: string;
  orderTime: string;
  orderId: string;
  reduceOnly: string;
  orderLinkId: string;
  symbol: string;
}

/**
 * Transform API data to table display format
 * @param orders - Raw order data from API
 * @returns Transformed data for table display
 */
function transformOrderData(orders: OpenOrderItem[]): OpenOrderTableData[] {
  return orders.map((order) => {
    const orderTime = new Date(order.created_at).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const tpSlText =
      order.take_profit > 0 || order.stop_loss > 0
        ? `${order.take_profit > 0 ? order.take_profit.toFixed(2) : '--'}/${order.stop_loss > 0 ? order.stop_loss.toFixed(2) : '--'}`
        : '+ Add';

    return {
      id: order.id,
      market: order.symbol,
      instrument: 'Spot', // Default to Spot for now
      orderType: order.order_type === 'limit' ? 'Limit' : 'Market',
      direction: order.side === 'buy' ? 'Buy' : 'Sell',
      orderPrice: order.price.toLocaleString('en-US', { minimumFractionDigits: 2 }),
      filledOrderQuantity: `${order.filled_quantity.toFixed(8)}/${order.quantity.toFixed(8)} ${order.symbol.replace('USDT', '')}`,
      order: order.cum_exec_value.toFixed(1),
      tpSl: tpSlText,
      tradeType: 'Open Long', // Default value
      orderTime: orderTime,
      orderId: order.order_id,
      reduceOnly: order.reduce_only ? 'Yes' : 'No',
      orderLinkId: order.order_link_id,
      symbol: order.symbol,
    };
  });
}

export function useOpenOrders(symbol?: string) {
  const { user } = useAppStore();
  const { data: currentApiKey } = useCurrentApiKey();

  const query = useQuery({
    queryKey: ['open-orders', symbol, currentApiKey?.api_key],
    queryFn: async (): Promise<OpenOrderTableData[]> => {
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

      const response = await Fetcher<OpenOrdersResponse>(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
          'X-User-ID': user.user_id || '',
        },
      });

      return transformOrderData(response.data);
    },

    enabled: !!user.token && !!user.user_id && !!currentApiKey?.api_key,
  });

  return query;
}
