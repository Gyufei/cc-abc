import { Badge, Button, toast } from '@medusajs/ui';
import { divide, multiply } from 'safebase';

import { useEffect, useMemo, useState } from 'react';

import { NumberInput } from '@/components/ui/number-input';
import { SliderBar } from '@/components/ui/slider-bar';

import { TOKEN_PRICE_MAP } from '@/lib/api/g-config';
import { TradingOrderRequest, useTradingOrders } from '@/lib/api/use-trading-orders';
import { useTokenBalance } from '@/lib/hooks/use-token-balance';
import { SIDE, TIME_IN_FORCE_TYPE } from '@/lib/types/trade';
import { cn } from '@/lib/utils';
import { truncateNumber } from '@/lib/utils/number';

import { AvailableBalance } from './available-balance';
import { CanAmountDisplay } from './can-amount-display';
import { TimeInForceSelect } from './time-in-force-select';
import { TpSlCheck } from './tp-sl-check';

export function LimitTrade({
  side,
  baseCoin,
  quoteCoin,
}: {
  side: SIDE;
  baseCoin: string | null;
  quoteCoin: string | null;
}) {
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [amount, setAmount] = useState('');
  const [progress, setProgress] = useState(0);
  const [tpSl, setTpSl] = useState(false);
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [timeInForce, setTimeInForce] = useState<TIME_IN_FORCE_TYPE>('GTC');

  const isBuy = side === 'buy';

  const { data: quoteBalance } = useTokenBalance(quoteCoin);
  const { data: baseBalance } = useTokenBalance(baseCoin);
  const tokenBalance = isBuy ? quoteBalance : baseBalance;

  const {
    mutate: createOrder,
    isPending: isCreatingOrder,
    isSuccess: isOrderCreated,
  } = useTradingOrders();

  // 计算当前 progress 应该的值
  const calculatedProgress = useMemo(() => {
    if (!tokenBalance || !amount || tokenBalance === '0') {
      return 0;
    }

    const ratio = divide(amount, String(tokenBalance));
    const percentage = multiply(ratio, '100');
    const progressValue = Math.min(100, Math.max(0, parseFloat(percentage)));

    return Math.round(progressValue);
  }, [amount, tokenBalance]);

  const amountInUSD = useMemo(() => {
    const quoteCoinPrice = quoteCoin ? TOKEN_PRICE_MAP[quoteCoin] : 0;
    if (amount && quoteCoinPrice) {
      return multiply(amount, String(quoteCoinPrice));
    }

    return '0';
  }, [amount, quoteCoin]);

  useEffect(() => {
    setProgress(calculatedProgress);
  }, [calculatedProgress]);

  useEffect(() => {
    handleReset();
  }, [side]);

  useEffect(() => {
    if (isOrderCreated) {
      handleReset();
    }
  }, [isOrderCreated]);

  const handleReset = () => {
    setPrice('');
    setQuantity('');
    setAmount('');
    setProgress(0);
    setTpSl(false);
    setTakeProfit('');
    setStopLoss('');
    setTimeInForce('GTC');
  };

  const handleProgressChange = (value: number) => {
    setProgress(value);

    if (!tokenBalance || tokenBalance === '0') {
      return;
    }

    const ratio = divide(String(value), '100');
    const balancePart = multiply(String(tokenBalance), ratio);

    if (isBuy) {
      setAmount(truncateNumber(balancePart.toString(), 6));
      if (price && price !== '0') {
        const newQuantity = divide(balancePart, price);
        setQuantity(truncateNumber(newQuantity.toString(), 6));
      }
    } else {
      setQuantity(truncateNumber(balancePart.toString(), 6));

      if (price && price !== '0') {
        const newOrderValue = multiply(String(balancePart), price);
        setAmount(truncateNumber(newOrderValue.toString(), 6));
      }
    }
  };

  // 处理输入变化
  const handlePriceChange = (value: string) => {
    setPrice(value);
    if (quantity) {
      if (value === '0' || value === '') {
        setAmount(value);
        return;
      }

      const oV = multiply(value, quantity);
      setAmount(oV.toString());
    } else {
      setAmount('');
    }
  };

  const handleQuantityChange = (value: string) => {
    setQuantity(value);
    if (price) {
      if (value === '0' || value === '') {
        setAmount(value);
        return;
      }
      const oV = multiply(price, value);
      setAmount(oV.toString());
    } else {
      setAmount('');
    }
  };

  const handleOrderValueChange = (value: string) => {
    setAmount(value);
    if (price) {
      if (price === '0' || value === '0' || value === '') {
        setQuantity('0');
        return;
      }

      const q = divide(value, price);
      setQuantity(truncateNumber(q.toString(), 6));
    }
  };

  const handleCreateOrder = () => {
    if (!baseCoin || !quoteCoin) {
      return;
    }

    if (!quantity) {
      toast.error('Please enter quantity to buy');
      return;
    }

    if (isBuy && Number(amount) > Number(quoteBalance)) {
      toast.error('Insufficient balance');
      return;
    }

    if (!isBuy && Number(quantity) > Number(baseBalance)) {
      toast.error('Insufficient balance');
      return;
    }

    const params: Omit<TradingOrderRequest, 'api_key'> = {
      category: 'spot',
      symbol: `${baseCoin}${quoteCoin}`,
      side: isBuy ? 'Buy' : 'Sell',
      order_type: 'Limit',
      qty: quantity,
      price: price,
      time_in_force: timeInForce,
    };

    if (tpSl && takeProfit) {
      params.take_profit = takeProfit;
      params.tp_order_type = 'Market';
    }

    if (tpSl && stopLoss) {
      params.stop_loss = stopLoss;
      params.sl_order_type = 'Market';
    }

    createOrder(params);
  };

  return (
    <div className="flex flex-col justify-stretch">
      <AvailableBalance balance={String(tokenBalance)} tokenName={isBuy ? quoteCoin : baseCoin} />
      <div className="relative mt-3">
        <NumberInput
          className="pr-4"
          placeholder="Price"
          id="search-input"
          value={price}
          onChange={handlePriceChange}
        />
        <Badge size="2xsmall" className="absolute right-2 top-1/2 -translate-y-1/2">
          {quoteCoin || '-'}
        </Badge>
      </div>
      <div className="relative mt-4">
        <NumberInput
          className="pr-4"
          placeholder="Quantity"
          id="search-input"
          value={quantity}
          onChange={handleQuantityChange}
        />
        <Badge size="2xsmall" className="absolute right-2 top-1/2 -translate-y-1/2">
          {baseCoin}
        </Badge>
      </div>
      <div className="mt-6">
        <SliderBar
          value={progress}
          max={100}
          onValueChange={handleProgressChange}
          disabled={!tokenBalance || !price}
        />
      </div>
      <div className="relative mt-4">
        <NumberInput
          className="pr-4"
          placeholder="Order Value"
          id="search-input"
          value={amount}
          onChange={handleOrderValueChange}
        />
        <Badge size="2xsmall" className="absolute right-2 top-4 -translate-y-1/2">
          {quoteCoin}
        </Badge>
        <span className="mt-2 smm-text text-ui-fg-muted">≈{amountInUSD} USD</span>
      </div>
      <div className="mt-4">
        <CanAmountDisplay
          side={side}
          baseCoin={baseCoin || ''}
          quoteCoin={quoteCoin || ''}
          price={price}
        />
      </div>
      <div className="mt-4 flex flex-col gap-y-2">
        <TpSlCheck
          side={side}
          value={tpSl}
          onChange={setTpSl}
          takeProfit={takeProfit}
          stopLoss={stopLoss}
          setTakeProfit={setTakeProfit}
          setStopLoss={setStopLoss}
          token={quoteCoin || ''}
          orderPrice={price}
          orderQuantity={quantity}
        />
        <TimeInForceSelect timeInForce={timeInForce} onTimeInForceChange={setTimeInForce} />
      </div>

      <div className="mt-6">
        <Button
          variant="secondary"
          disabled={isCreatingOrder}
          isLoading={isCreatingOrder}
          onClick={handleCreateOrder}
          className={cn(
            'w-full text-sm font-medium leading-5 text-ui-fg-on-color',
            side === 'buy'
              ? 'bg-ui-green hover:bg-ui-green-hover active:bg-ui-green-active'
              : 'bg-ui-red hover:bg-ui-red-hover active:bg-ui-red-active'
          )}
        >
          {side === 'buy' ? 'Buy' : 'Sell'}
        </Button>
      </div>
    </div>
  );
}
