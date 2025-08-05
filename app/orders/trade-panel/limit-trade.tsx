import { Badge, Button } from '@medusajs/ui';

import { useState } from 'react';

import { NumberInput } from '@/components/ui/number-input';
import { SliderBar } from '@/components/ui/slider-bar';

import { CANCEL_TYPE, SIDE } from '@/lib/types/trade';
import { cn } from '@/lib/utils';

import { AvailableBalance } from './available-balance';
import { PostOnlyCheck } from './post-only-check';
import { TPSLCheck } from './tp-sl-check';

const TOKEN0_NAME = 'USDT';
const TOKEN1_NAME = 'SCA';

export function LimitTrade({
  side,
  token0,
  token1,
}: {
  side: SIDE;
  token0: string | null;
  token1: string | null;
}) {
  const [num, setNum] = useState('');
  const [quantity, setQuantity] = useState('');
  const [progress, setProgress] = useState(0);
  const [orderValue, setOrderValue] = useState('');
  const [tpSl, setTpSl] = useState(false);
  const [postOnly, setPostOnly] = useState(false);
  const [cancelType, setCancelType] = useState<CANCEL_TYPE>('Good-Till-Cancel');

  const isBuy = side === 'buy';

  return (
    <div className="flex flex-col justify-stretch">
      <AvailableBalance balance="0.000046" tokenName={isBuy ? token1 : token0} />
      <div className="relative mt-3">
        <NumberInput
          className="pr-4"
          placeholder="Price"
          id="search-input"
          value={num}
          onChange={(value) => setNum(value)}
        />
        <Badge size="2xsmall" className="absolute right-2 top-1/2 -translate-y-1/2">
          {token1 || '-'}
        </Badge>
      </div>
      <div className="relative mt-4">
        <NumberInput
          className="pr-4"
          placeholder="Quantity"
          id="search-input"
          value={quantity}
          onChange={(value) => setQuantity(value)}
        />
        <Badge size="2xsmall" className="absolute right-2 top-1/2 -translate-y-1/2">
          {token0}
        </Badge>
      </div>
      <div className="mt-6">
        <SliderBar value={progress} max={100} onValueChange={(value) => setProgress(value)} />
      </div>
      <div className="relative mt-4">
        <NumberInput
          className="pr-4"
          placeholder="Order Value"
          id="search-input"
          value={orderValue}
          onChange={(value) => setOrderValue(value)}
        />
        <Badge size="2xsmall" className="absolute right-2 top-4 -translate-y-1/2">
          {token1}
        </Badge>
        <span className="mt-2 smm-text text-ui-fg-muted">≈0.00 USD</span>
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
            <span className="smm-text text-ui-fg-base">Order Value:</span>
            <span className="smm-text text-ui-fg-subtle ">0.000046 {token1}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-y-2">
        <TPSLCheck value={tpSl} onChange={setTpSl} />
        <PostOnlyCheck
          value={postOnly}
          onChange={setPostOnly}
          cancelType={cancelType}
          setCancelType={setCancelType}
        />
      </div>

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
