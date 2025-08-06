import { Badge, Button, Input, Select } from '@medusajs/ui';
import { divide, multiply } from 'safebase';

import { useEffect, useMemo, useState } from 'react';

import { NumberInput } from '@/components/ui/number-input';
import { SliderBar } from '@/components/ui/slider-bar';

import { TOKEN_PRICE_MAP } from '@/lib/api/g-config';
import { useTokenBalance } from '@/lib/hooks/use-token-balance';
import { SIDE, TIME_IN_FORCE_TYPE } from '@/lib/types/trade';
import { cn } from '@/lib/utils';
import { truncateNumber } from '@/lib/utils/number';

import { AvailableBalance } from './available-balance';
import { TimeInForceSelect } from './time-in-force-select';

const TYPE_OPTIONS = ['Limit', 'Market'];

export function TpSlTrade({
  side,
  baseCoin,
  quoteCoin,
}: {
  side: SIDE;
  baseCoin: string | null;
  quoteCoin: string | null;
}) {
  const [triggerPrice, setTriggerPrice] = useState('');
  const [type, setType] = useState<'Limit' | 'Market'>('Limit');

  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [amount, setAmount] = useState('');
  const [progress, setProgress] = useState(0);
  const [timeInForce, setTimeInForce] = useState<TIME_IN_FORCE_TYPE>('GTC');

  const isBuy = side === 'buy';

  const { data: tokenBalance } = useTokenBalance(isBuy ? quoteCoin : baseCoin);

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

  useEffect(() => {
    setProgress(calculatedProgress);
  }, [calculatedProgress]);

  const handleProgressChange = (value: number) => {
    setProgress(value);

    if (!tokenBalance || tokenBalance === '0') {
      return;
    }

    const ratio = divide(String(value), '100');
    const newOrderValue = multiply(String(tokenBalance), ratio);
    setAmount(truncateNumber(newOrderValue.toString(), 6));

    if (price && price !== '0') {
      const newQuantity = divide(newOrderValue, price);
      setQuantity(truncateNumber(newQuantity.toString(), 6));
    }
  };

  const handleTriggerPriceChange = (value: string) => {
    setTriggerPrice(value);
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

  const orderValueInUSD = useMemo(() => {
    const quoteCoinPrice = quoteCoin ? TOKEN_PRICE_MAP[quoteCoin] : 0;
    if (amount && quoteCoinPrice) {
      return multiply(amount, String(quoteCoinPrice));
    }

    return '0';
  }, [amount, quoteCoin]);

  return (
    <div className="flex flex-col justify-stretch">
      <AvailableBalance balance={String(tokenBalance)} tokenName={isBuy ? quoteCoin : baseCoin} />
      <div className="relative mt-3">
        <NumberInput
          className="pr-4"
          placeholder="Trigger Price"
          id="search-input"
          value={triggerPrice}
          onChange={handleTriggerPriceChange}
        />
        <Badge size="2xsmall" className="absolute right-2 top-1/2 -translate-y-1/2">
          {quoteCoin || '-'}
        </Badge>
      </div>
      <div className="mt-3 flex justify-between gap-2 items-center">
        <div className="relative flex-1">
          {type === 'Limit' ? (
            <>
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
            </>
          ) : (
            <Input disabled />
          )}
        </div>
        <Select value={type} onValueChange={(value) => setType(value as 'Limit' | 'Market')}>
          <Select.Trigger className="w-[85px]">
            <Select.Value placeholder="" />
          </Select.Trigger>
          <Select.Content className="p-1">
            {TYPE_OPTIONS.map((item) => (
              <Select.Item key={item} value={item} className="sl-option-1 p-0">
                {item}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </div>
      <div className="relative mt-4">
        {type === 'Limit' ? (
          <>
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
          </>
        ) : (
          <>
            <NumberInput
              className="pr-4"
              placeholder="Value"
              id="search-input"
              value={amount}
              onChange={handleOrderValueChange}
            />
            <Badge size="2xsmall" className="absolute right-2 top-1/2 -translate-y-1/2">
              {quoteCoin || '-'}
            </Badge>
          </>
        )}
      </div>
      <div className="mt-6">
        <SliderBar
          value={progress}
          max={100}
          onValueChange={handleProgressChange}
          disabled={!tokenBalance || !price}
        />
      </div>
      {type === 'Limit' && (
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
          <span className="mt-2 smm-text text-ui-fg-muted">≈{orderValueInUSD} USD</span>
        </div>
      )}
      {/* <div className="mt-4">
        <div
          className="flex py-[10px] px-3 items-center rounded-lg bg-ui-bg-field gap-3"
          style={{
            boxShadow:
              '0px 0px 0px 1px rgba(0, 0, 0, 0.08),0px 1px 2px -1px rgba(0, 0, 0, 0.08),0px 2px 4px 0px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div className="bg-ui-bg-interactive rounded-full h-[13px] w-1"></div>
          <div className="flex items-center">
            <span className="smm-text text-ui-fg-base">Order Value:</span>
            <span className="smm-text text-ui-fg-subtle ">0.000046 {token1}</span>
          </div>
        </div>
      </div> */}
      {type === 'Limit' && (
        <div className="mt-4 flex flex-col gap-y-2">
          <TimeInForceSelect timeInForce={timeInForce} onTimeInForceChange={setTimeInForce} />
        </div>
      )}

      <div className="mt-6">
        <Button
          variant="secondary"
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
