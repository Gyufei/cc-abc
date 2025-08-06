import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Fetcher } from '../fetcher';
import { useAppStore } from '../store';
import { ApiPath } from './api-path';

// Cancel order request interface
export interface CancelOrderRequest {
  api_key: string;
  category: string;
  symbol: string;
  order_link_id: string;
}

// Cancel order response interface
export interface CancelOrderResponse {
  code: number;
  msg: string;
  data: {
    order_id: string;
    order_link_id: string;
  };
}

/**
 * Cancel an order via API
 * @param request - Cancel order request parameters
 */
async function cancelOrder(request: CancelOrderRequest): Promise<CancelOrderResponse> {
  const { user } = useAppStore.getState();

  if (!user.token || !user.user_id) {
    throw new Error('用户未登录');
  }

  return Fetcher<CancelOrderResponse>(ApiPath.cancelOrder, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`,
      'X-User-ID': user.user_id,
    },
    body: JSON.stringify(request),
  });
}

/**
 * Hook to cancel an order with optimistic updates
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: (data, _variables) => {
      // Invalidate and refetch open orders to reflect the cancellation
      queryClient.invalidateQueries({ queryKey: ['openOrders'] });

      // Optionally show success message
      console.log('Order cancelled successfully:', data);
    },
    onError: (error) => {
      // Handle error
      console.error('Failed to cancel order:', error);
    },
  });
}
