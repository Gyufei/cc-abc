import { Badge, Checkbox, Label } from '@medusajs/ui';
import { divide, multiply, subtract } from 'safebase';

import { useMemo } from 'react';

import Loop from '@/components/icons/loop';
import { NumberInput } from '@/components/ui/number-input';

import { SIDE } from '@/lib/types/trade';
import { cn } from '@/lib/utils';
import { formatNumber, formatPercentage, truncateNumber } from '@/lib/utils/number';

export function TpSlCheck({
  side,
  value,
  onChange,
  takeProfit,
  stopLoss,
  setTakeProfit,
  setStopLoss,
  token,
  orderPrice,
  orderQuantity,
}: {
  side: SIDE;
  value: boolean;
  onChange: (value: boolean) => void;
  takeProfit: string;
  stopLoss: string;
  setTakeProfit: (value: string) => void;
  setStopLoss: (value: string) => void;
  token: string;
  orderPrice: string;
  orderQuantity: string;
}) {
  function handleValueChange(val: boolean) {
    onChange(val);
    if (!value) {
      setTakeProfit('');
      setStopLoss('');
    }
  }

  const takePricePnl = useMemo(() => {
    const pnl = subtract(String(takeProfit), String(orderPrice));
    return side === 'buy' ? pnl : multiply(pnl, String(-1));
  }, [takeProfit, orderPrice, side]);

  const takeProfitPnl = useMemo(() => {
    const takePnl = multiply(takePricePnl, String(orderQuantity));
    return takePnl;
  }, [takePricePnl, orderQuantity]);

  const takeProfitRoi = useMemo(() => {
    const roi = truncateNumber(divide(String(takePricePnl), String(orderPrice)), 4);
    return roi;
  }, [takePricePnl, orderPrice]);

  const stopPricePnl = useMemo(() => {
    const pnl = subtract(String(stopLoss), String(orderPrice));
    return side === 'buy' ? pnl : multiply(pnl, String(-1));
  }, [stopLoss, orderPrice, side]);

  const stopLossPnl = useMemo(() => {
    const stopPnl = multiply(stopPricePnl, String(orderQuantity));
    return stopPnl;
  }, [stopPricePnl, orderQuantity]);

  const stopLossRoi = useMemo(() => {
    const roi = truncateNumber(divide(String(stopPricePnl), String(orderPrice)), 4);
    return roi;
  }, [stopPricePnl, orderPrice]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 flex items-center justify-center">
            <Checkbox checked={value} onCheckedChange={handleValueChange} id="tp-sl" />
          </div>
          <Label htmlFor="tp-sl" className="smm-text text-ui-fg-base">
            TP/SL
          </Label>
        </div>

        {value && (
          <div className="flex items-center gap-2">
            <span className="smm-text text-ui-fg-subtle">Basic</span>
            <Loop />
          </div>
        )}
      </div>

      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out px-[1px] pb-[1px]',
          value ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="relative mt-4">
          <NumberInput
            className="pr-4"
            placeholder="Take Profit"
            id="search-input"
            value={takeProfit}
            onChange={setTakeProfit}
          />
          <Badge size="2xsmall" className="absolute right-2 top-4 -translate-y-1/2">
            {token}
          </Badge>

          {Number(takeProfit) !== 0 ? (
            <div className="text-[10px] mt-[4px]">
              <span>Est. PnL </span>
              <span className={cn(Number(takeProfitPnl) < 0 ? 'text-ui-red' : 'text-ui-green')}>
                {formatNumber(takeProfitPnl)}
              </span>
              <span>
                &nbsp;(ROI{' '}
                <span className={cn(Number(takeProfitRoi) < 0 ? 'text-ui-red' : 'text-ui-green')}>
                  {formatPercentage(takeProfitRoi)}
                </span>
                )
              </span>
            </div>
          ) : (
            <div className="h-[15px] mt-1"></div>
          )}
        </div>

        <div className="relative">
          <NumberInput
            className="pr-4"
            placeholder="Stop Loss"
            id="search-input"
            value={stopLoss}
            onChange={setStopLoss}
          />
          <Badge size="2xsmall" className="absolute right-2 top-4 -translate-y-1/2">
            {token}
          </Badge>

          {Number(stopLoss) !== 0 ? (
            <div className="text-[10px] mt-[4px]">
              <span>Est. PnL </span>
              <span className={cn(Number(stopLossPnl) < 0 ? 'text-ui-red' : 'text-ui-green')}>
                {formatNumber(stopLossPnl)}
              </span>
              <span>
                &nbsp;(ROI{' '}
                <span className={cn(Number(stopLossRoi) < 0 ? 'text-ui-red' : 'text-ui-green')}>
                  {formatPercentage(stopLossRoi)}
                </span>
                )
              </span>
            </div>
          ) : (
            <div className="h-[15px] mb-1"></div>
          )}
        </div>
      </div>
    </div>
  );
}
