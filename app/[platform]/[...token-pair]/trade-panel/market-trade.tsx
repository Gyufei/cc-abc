import { Button, toast } from '@medusajs/ui';
import { divide, multiply } from 'safebase';

import { useEffect, useState } from 'react';

import { NumberInput } from '@/components/ui/number-input';
import { SliderBar } from '@/components/ui/slider-bar';

import { useMarketInfo } from '@/lib/api/use-market-info';
import { useTokenPairs } from '@/lib/api/use-token-pairs';
import { TradingOrderRequest, useCreateOrders } from '@/lib/api/use-trading-orders';
import { useCurrentApiKey } from '@/lib/hooks/use-current-api-key';
import { useTokenBalance } from '@/lib/hooks/use-token-balance';
import { SIDE } from '@/lib/types/trade';
import { cn } from '@/lib/utils';
import { fixedNumber, mantissaNum, truncateNumber } from '@/lib/utils/number';

import { AvailableBalance } from './available-balance';
import { CanAmountDisplay } from './can-amount-display';
import { OrderByTokenSelect } from './order-by-token-select';
import { SlippageTolerance } from './slippage-tolerance';
import { WarnSlippageTolerance } from './warn-slippage-tolerance';

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
  const { data: currentApiKeyObj } = useCurrentApiKey();
  const isBigGet = currentApiKeyObj?.platform === 'bitget';

  const [buyValue, setBuyValue] = useState('');
  const [quantity, setQuantity] = useState('');
  const [progress, setProgress] = useState(0);
  const [slippageToleranceChecked, setSlippageToleranceChecked] = useState(false);
  const [selectedSlippage, setSelectedSlippage] = useState('0.1');

  const [slippageData, setSlippageData] = useState({
    truncateSlippageChecked: false,
    warnSlippageChecked: false,
    truncateSlippage: 1,
    warnSlippage: 2,
  });

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
    if (isBuy) {
      if (marketUnitToken === quoteCoin) {
        const pro = calcProgress(String(buyValue), String(quoteBalance));
        setProgress(pro);
      }

      if (marketUnitToken === baseCoin) {
        const shouldPay = multiply(String(quantity), String(marketInfo?.price || '0'));
        const pro = calcProgress(String(shouldPay), String(quoteBalance));
        setProgress(pro);
      }
    } else {
      if (marketUnitToken === baseCoin) {
        const pro = calcProgress(String(quantity), String(baseBalance));
        setProgress(pro);
      }

      if (marketUnitToken === quoteCoin) {
        if (!marketInfo?.price || Number(marketInfo.price) === 0) {
          return;
        }

        const shouldSell = divide(String(buyValue), String(marketInfo?.price || '0'));
        const pro = calcProgress(String(shouldSell), String(baseBalance));
        setProgress(pro);
      }
    }
  }, [
    isBuy,
    quantity,
    baseBalance,
    quoteBalance,
    marketInfo,
    marketUnitToken,
    baseCoin,
    quoteCoin,
    buyValue,
  ]);

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
    setSlippageData({
      truncateSlippageChecked: false,
      warnSlippageChecked: false,
      truncateSlippage: 5,
      warnSlippage: 1,
    });
  };

  const handleProgressChange = (value: number) => {
    setProgress(value);
    const ratio = divide(String(value), '100');

    if (isBuy) {
      if (marketUnitToken === quoteCoin) {
        const newValue = multiply(String(quoteBalance), ratio);
        setBuyValue(mantissaNum(newValue, minimumFractionDigitsForQuote));
      }

      if (marketUnitToken === baseCoin) {
        if (!marketInfo?.price || Number(marketInfo.price) === 0) {
          return;
        }

        const canBuy = divide(String(quoteBalance), String(marketInfo.price));
        const newQ = multiply(canBuy, ratio);
        setQuantity(mantissaNum(newQ.toString(), minimumFractionDigitsForBase));
      }
    } else {
      if (marketUnitToken === baseCoin) {
        const newQ = multiply(String(baseBalance), ratio);
        setQuantity(mantissaNum(newQ.toString(), minimumFractionDigitsForBase));
      }

      if (marketUnitToken === quoteCoin) {
        if (!marketInfo?.price || Number(marketInfo.price) === 0) {
          return;
        }

        const canSell = multiply(String(baseBalance), String(marketInfo.price || 0));
        const newBuyValue = multiply(canSell, ratio);
        setBuyValue(mantissaNum(newBuyValue.toString(), minimumFractionDigitsForQuote));
      }
    }
  };

  const handleBuyValueChange = (value: string) => {
    setBuyValue(value);
  };

  const handleQuantityChange = (value: string) => {
    setQuantity(value);
  };

  const handleCreateOrder = () => {
    if (marketUnitToken === quoteCoin && !buyValue) {
      toast.error(`Please enter the value to ${isBuy ? 'buy' : 'sell'}.`);
      return;
    }

    if (marketUnitToken === baseCoin && !quantity) {
      toast.error(`Please enter the quantity to ${isBuy ? 'buy' : 'sell'}.`);
      return;
    }

    const params: Omit<TradingOrderRequest, 'api_key'> = {
      category: 'spot',
      symbol: `${baseCoin}${quoteCoin}`,
      side: isBuy ? 'Buy' : 'Sell',
      order_type: 'Market',
      qty: marketUnitToken === baseCoin ? quantity : buyValue,
      market_unit: marketUnitToken === baseCoin ? 'baseCoin' : 'quoteCoin',
    };

    if (isBuy && isBigGet) {
      params.market_unit = 'quoteCoin';

      const buyAmount =
        marketUnitToken === baseCoin
          ? multiply(quantity, String(marketInfo?.price || '0'))
          : buyValue;
      params.qty = buyAmount;
    }

    if (!isBuy && isBigGet) {
      params.market_unit = 'baseCoin';

      const sellQuantity =
        marketUnitToken === baseCoin
          ? quantity
          : truncateNumber(
              divide(buyValue, String(marketInfo?.price || '0')),
              minimumFractionDigitsForBase
            );
      params.qty = sellQuantity;
    }

    if (slippageToleranceChecked && !isBigGet) {
      params.slippage_tolerance_type = 'TickSize';
      params.slippage_tolerance = multiply(selectedSlippage, String(100));
    }

    createOrder(params);
  };

  return (
    <div className="flex flex-col justify-stretch">
      <AvailableBalance
        balance={fixedNumber(
          isBuy ? quoteBalance : baseBalance,
          isBuy ? minimumFractionDigitsForQuote : minimumFractionDigitsForBase
        )}
        tokenName={isBuy ? quoteCoin : baseCoin}
      />
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
          baseDigit={minimumFractionDigitsForBase}
          quoteDigit={minimumFractionDigitsForQuote}
        />
      </div>
      <div className="mt-4 flex flex-col gap-y-2">
        {!isBigGet ? (
          <SlippageTolerance
            value={slippageToleranceChecked}
            onChange={setSlippageToleranceChecked}
            selectedSlippage={selectedSlippage}
            setSelectedSlippage={setSelectedSlippage}
            token={quoteCoin || ''}
          />
        ) : (
          <WarnSlippageTolerance
            slippageData={slippageData}
            onSlippageDataChange={setSlippageData}
          />
        )}
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
