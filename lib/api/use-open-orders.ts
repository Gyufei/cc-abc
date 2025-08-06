import { useState, useEffect } from 'react';
import { Fetcher as _Fetcher } from '../fetcher';
import { ApiPath as _ApiPath } from './api-path';
import { useCurrentApiKey } from '@/lib/hooks/use-current-api-key';

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
 * Fetch open orders from API
 * @param apiKey - API key for authentication
 * @param symbol - Trading symbol (optional)
 * @returns Promise with open orders data
 */
export async function fetchOpenOrders(
  _apiKey: string,
  _symbol?: string
): Promise<OpenOrdersResponse> {
  // Mock data for now - replace with real API call when service is ready
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockData: OpenOrdersResponse = {
    data: [
      {
        id: "2005276490169849088",
        user_id: "e22128f7-c5db-4e5a-bdef-9dca78179132",
        symbol: "BTCUSDT",
        side: "buy",
        order_type: "limit",
        quantity: 0.00362,
        price: 129600,
        filled_quantity: 0.000504,
        status: "partiallyfilled",
        created_at: "2025-07-29T10:06:25.746Z",
        updated_at: "2025-07-29T10:06:25.752Z",
        order_id: "2005276490169849088",
        order_link_id: "d767d29f-d843-4b36-9fc1-5384a078e089",
        avg_price: 129600,
        leaves_qty: 0.003116,
        cum_exec_qty: 0.000504,
        cum_exec_value: 65.3184,
        cum_exec_fee: 5.04e-7,
        time_in_force: "GTC",
        stop_order_type: "",
        trigger_price: 0,
        take_profit: 0,
        stop_loss: 0,
        reduce_only: false,
        close_on_trigger: false
      }
    ]
  };
  
  return mockData;
  
  // Real API call implementation (commented out for now)
  /*
  const params = new URLSearchParams({
    api_key: apiKey,
    ...(symbol && { symbol })
  });
  
  const url = `${ApiPath.tradingOrders}?${params.toString()}`;
  
  const response = await Fetcher.get(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch open orders: ${response.statusText}`);
  }
  
  return response.json();
  */
}

/**
 * Transform API data to table display format
 * @param orders - Raw order data from API
 * @returns Transformed data for table display
 */
function transformOrderData(orders: OpenOrderItem[]): OpenOrderTableData[] {
  return orders.map(order => {
    const orderTime = new Date(order.created_at).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const tpSlText = order.take_profit > 0 || order.stop_loss > 0 
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

/**
 * Hook to fetch and manage open orders data
 * @param symbol - Trading symbol filter
 * @returns Object containing orders data, loading state, and error state
 */
export function useOpenOrders(symbol?: string) {
  const [data, setData] = useState<OpenOrderTableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { data: currentApiKeyData } = useCurrentApiKey();
  
  useEffect(() => {
    if (!currentApiKeyData?.api_key) {
      setLoading(false);
      setError('No API key available');
      return;
    }
    
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchOpenOrders(currentApiKeyData.api_key, symbol);
        const transformedData = transformOrderData(response.data);
        setData(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load open orders');
      } finally {
        setLoading(false);
      }
    };
    
    loadOrders();
  }, [currentApiKeyData?.api_key, symbol]);
  
  return { data, loading, error };
}