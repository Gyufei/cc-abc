import { Badge, Button } from '@medusajs/ui';
import { divide, multiply } from 'safebase';

import { useEffect, useMemo, useState } from 'react';

import { NumberInput } from '@/components/ui/number-input';
import { SliderBar } from '@/components/ui/slider-bar';

import { TOKEN_PRICE_MAP } from '@/lib/api/g-config';
import { useMarketInfo } from '@/lib/api/use-market-info';
import { useTradingOrders } from '@/lib/api/use-trading-orders';
import { useTokenBalance } from '@/lib/hooks/use-token-balance';
import { SIDE } from '@/lib/types/trade';
import { cn } from '@/lib/utils';
import { truncateNumber } from '@/lib/utils/number';

import { AvailableBalance } from './available-balance';
import { SlippageTolerance } from './slippage-tolerance';

export function MarketTrade({
  side,
  baseCoin,
  quoteCoin,
}: {
  side: SIDE;
  baseCoin: string | null;
  quoteCoin: string | null;
}) {
  const [buyValue, setBuyValue] = useState('');
  const [quantity, setQuantity] = useState('');
  const [progress, setProgress] = useState(0);
  const [slippageTolerance, setSlippageTolerance] = useState(false);
  const [selectedSlippage, setSelectedSlippage] = useState('0.1');

  const isBuy = side === 'buy';

  const { data: tokenBalance } = useTokenBalance(isBuy ? quoteCoin : baseCoin);
  const { data: marketInfo } = useMarketInfo(`${baseCoin}${quoteCoin}`);

  const { mutate: createOrder, isPending: isCreatingOrder } = useTradingOrders();

  const orderValue = useMemo(() => {
    if (isBuy) {
      return buyValue;
    }

    return multiply(String(marketInfo?.price || 0), String(quantity));
  }, [buyValue, quantity, isBuy, marketInfo]);

  // 计算当前 progress 应该的值
  const calculatedProgress = useMemo(() => {
    if (!tokenBalance || tokenBalance === '0') {
      return 0;
    }

    const flagValue = isBuy ? buyValue : quantity;

    const ratio = divide(String(flagValue), String(tokenBalance));
    const percentage = multiply(ratio, '100');
    const progressValue = Math.min(100, Math.max(0, parseFloat(percentage)));

    return Math.round(progressValue);
  }, [buyValue, quantity, tokenBalance, isBuy]);

  useEffect(() => {
    setProgress(calculatedProgress);
  }, [calculatedProgress]);

  useEffect(() => {
    setBuyValue('');
    setQuantity('');
  }, [side]);

  const handleBuyValueChange = (value: string) => {
    setBuyValue(value);
  };

  const handleProgressChange = (value: number) => {
    setProgress(value);

    if (!tokenBalance || tokenBalance === '0') {
      return;
    }

    // 根据 progress 百分比计算新的 orderValue
    const ratio = divide(String(value), '100');
    const newValue = multiply(String(tokenBalance), ratio);

    if (isBuy) {
      setBuyValue(truncateNumber(newValue.toString(), 6));
    } else {
      setQuantity(truncateNumber(newValue.toString(), 6));
    }
  };

  const handleQuantityChange = (value: string) => {
    setQuantity(value);
  };

  const orderValueInUSD = useMemo(() => {
    const quoteCoinPrice = quoteCoin ? TOKEN_PRICE_MAP[quoteCoin] : 0;
    if (orderValue && quoteCoinPrice) {
      return truncateNumber(multiply(orderValue, String(quoteCoinPrice)), 2);
    }

    return '0';
  }, [orderValue, quoteCoin]);

  const handleCreateOrder = () => {
    createOrder({
      category: 'spot',
      symbol: `${baseCoin}${quoteCoin}`,
      side: isBuy ? 'Buy' : 'Sell',
      order_type: 'market',
      qty: isBuy ? buyValue : quantity,
    });
  };

  return (
    <div className="flex flex-col justify-stretch">
      <AvailableBalance balance={String(tokenBalance)} tokenName={isBuy ? quoteCoin : baseCoin} />
      {isBuy ? (
        <div className="relative mt-3">
          <NumberInput
            className="pr-4"
            placeholder="Value"
            id="search-input"
            value={buyValue}
            onChange={handleBuyValueChange}
          />
          <Badge size="2xsmall" className="absolute right-2 top-1/2 -translate-y-1/2">
            {quoteCoin || '-'}
          </Badge>
        </div>
      ) : (
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
      )}
      <div className="mt-6">
        <SliderBar
          value={progress}
          max={100}
          onValueChange={handleProgressChange}
          disabled={!tokenBalance}
        />
      </div>
      <div className="mt-4">
        <div
          className="flex py-[10px] px-3 items-center rounded-lg bg-ui-bg-field gap-3"
          style={{
            boxShadow:
              '0px 0px 0px 1px rgba(0, 0, 0, 0.08),0px 1px 2px -1px rgba(0, 0, 0, 0.08),0px 2px 4px 0px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div className="bg-ui-bg-interactive rounded-full h-[13px] w-1"></div>
          <div className="flex items-center">
            <span className="smm-text text-ui-fg-base">Order Value:&nbsp;</span>
            <span className="smm-text text-ui-fg-subtle ">
              {orderValueInUSD} {quoteCoin}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-y-2">
        <SlippageTolerance
          value={slippageTolerance}
          onChange={setSlippageTolerance}
          selectedSlippage={selectedSlippage}
          setSelectedSlippage={setSelectedSlippage}
          token={quoteCoin || ''}
        />
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
