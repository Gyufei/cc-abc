import { Button } from '@medusajs/ui';
import { divide, multiply } from 'safebase';

import { useEffect, useState } from 'react';

import { NumberInput } from '@/components/ui/number-input';
import { SliderBar } from '@/components/ui/slider-bar';

import { useMarketInfo } from '@/lib/api/use-market-info';
import { useTokenPairs } from '@/lib/api/use-token-pairs';
import { TradingOrderRequest, useCreateOrders } from '@/lib/api/use-trading-orders';
import { useTokenBalance } from '@/lib/hooks/use-token-balance';
import { SIDE } from '@/lib/types/trade';
import { cn } from '@/lib/utils';
import { truncateNumber } from '@/lib/utils/number';

import { AvailableBalance } from './available-balance';
import { CanAmountDisplay } from './can-amount-display';
import { OrderByTokenSelect } from './order-by-token-select';
import { SlippageTolerance } from './slippage-tolerance';

function calcProgress(value: string, balance: string) {
  if (Number(value) === 0 || Number(balance) === 0) {
    return 0;
  }

  const ratio = divide(String(value), String(balance));
  const percentage = multiply(ratio, '100');
  const progressValue = Math.min(100, Math.max(0, parseFloat(percentage)));
  return Math.round(progressValue);
}

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
  const [slippageToleranceChecked, setSlippageToleranceChecked] = useState(false);
  const [selectedSlippage, setSelectedSlippage] = useState('0.1');

  const isBuy = side === 'buy';

  const [marketUnitToken, setMarketUnit] = useState<string>(
    isBuy ? quoteCoin || '' : baseCoin || ''
  );

  const { data: quoteBalance } = useTokenBalance(quoteCoin || '');
  const { data: baseBalance } = useTokenBalance(baseCoin || '');
  const tokenBalance = isBuy ? quoteBalance : baseBalance;

  const { data: marketInfo } = useMarketInfo(baseCoin || '', quoteCoin || '');

  const { data: tokenPairs } = useTokenPairs();
  const tokenPair = (tokenPairs || []).find((pair) => pair.symbol === `${baseCoin}${quoteCoin}`);
  const minimumFractionDigitsForBase = Math.abs(Math.log10(Number(tokenPair?.base_asset_step)));
  const minimumFractionDigitsForQuote = Math.abs(Math.log10(Number(tokenPair?.quote_asset_step)));

  const {
    mutate: createOrder,
    isPending: isCreatingOrder,
    isSuccess: isOrderCreated,
  } = useCreateOrders();

  useEffect(() => {
    const flagValue = marketUnitToken === baseCoin ? quantity : buyValue;
    const useBalance = marketUnitToken === baseCoin ? baseBalance : quoteBalance;
    const pro = calcProgress(String(flagValue), String(useBalance));
    setProgress(pro);
  }, [buyValue, quantity, marketUnitToken, baseBalance, quoteBalance, baseCoin]);

  useEffect(() => {
    handleReset();
  }, [side]);

  useEffect(() => {
    if (isOrderCreated) {
      handleReset();
    }
  }, [isOrderCreated]);

  const handleReset = () => {
    setBuyValue('');
    setQuantity('');
    setProgress(0);
    setSlippageToleranceChecked(false);
    setSelectedSlippage('0.1');
  };

  const handleProgressChange = (value: number) => {
    setProgress(value);

    if (!tokenBalance || tokenBalance === '0') {
      return;
    }

    const ratio = divide(String(value), '100');
    const useBalance = marketUnitToken === baseCoin ? baseBalance : quoteBalance;
    const newValue = multiply(String(useBalance), ratio);

    if (marketUnitToken === baseCoin) {
      setQuantity(truncateNumber(newValue.toString(), 6));
    } else {
      setBuyValue(truncateNumber(newValue.toString(), 6));
    }
  };

  const handleBuyValueChange = (value: string) => {
    setBuyValue(value);
  };

  const handleQuantityChange = (value: string) => {
    setQuantity(value);
  };

  const handleCreateOrder = () => {
    const params: Omit<TradingOrderRequest, 'api_key'> = {
      category: 'spot',
      symbol: `${baseCoin}${quoteCoin}`,
      side: isBuy ? 'Buy' : 'Sell',
      order_type: 'Market',
      qty: marketUnitToken === baseCoin ? quantity : buyValue,
      market_unit: marketUnitToken === baseCoin ? 'baseCoin' : 'quoteCoin',
    };

    if ((isBuy && marketUnitToken === baseCoin) || (!isBuy && marketUnitToken === quoteCoin)) {
      // params.price = String(marketInfo?.price || '0');
    }

    if (slippageToleranceChecked) {
      params.slippage_tolerance_type = 'TickSize';
      params.slippage_tolerance = multiply(selectedSlippage, String(100));
    }

    createOrder(params);
  };

  return (
    <div className="flex flex-col justify-stretch">
      <AvailableBalance balance={String(tokenBalance)} tokenName={isBuy ? quoteCoin : baseCoin} />
      {marketUnitToken === quoteCoin ? (
        <div className="relative mt-3">
          <NumberInput
            className="pr-4"
            placeholder="Value"
            id="search-input"
            value={buyValue}
            onChange={handleBuyValueChange}
            decimalPlaces={minimumFractionDigitsForQuote}
          />
          <OrderByTokenSelect
            baseCoin={baseCoin || ''}
            quoteCoin={quoteCoin || ''}
            marketUnitToken={marketUnitToken}
            setMarketUnit={setMarketUnit}
          />
        </div>
      ) : (
        <div className="relative mt-4">
          <NumberInput
            className="pr-4"
            placeholder="Quantity"
            id="search-input"
            value={quantity}
            onChange={handleQuantityChange}
            decimalPlaces={minimumFractionDigitsForBase}
          />
          <OrderByTokenSelect
            baseCoin={baseCoin || ''}
            quoteCoin={quoteCoin || ''}
            marketUnitToken={marketUnitToken}
            setMarketUnit={setMarketUnit}
          />
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
        <CanAmountDisplay
          side={side}
          baseCoin={baseCoin || ''}
          quoteCoin={quoteCoin || ''}
          price={String(marketInfo?.price || '0')}
        />
      </div>
      <div className="mt-4 flex flex-col gap-y-2">
        <SlippageTolerance
          value={slippageToleranceChecked}
          onChange={setSlippageToleranceChecked}
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
