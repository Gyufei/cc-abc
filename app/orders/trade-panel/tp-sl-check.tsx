import { Badge, Checkbox, Label } from '@medusajs/ui';
import { divide, subtract } from 'safebase';

import { useMemo } from 'react';

import Loop from '@/components/icons/loop';
import { NumberInput } from '@/components/ui/number-input';

import { cn } from '@/lib/utils';
import { formatNumber, formatPercentage, truncateNumber } from '@/lib/utils/number';

export function TpSlCheck({
  value,
  onChange,
  takeProfit,
  stopLoss,
  setTakeProfit,
  setStopLoss,
  token,
  balance,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
  takeProfit: string;
  stopLoss: string;
  setTakeProfit: (value: string) => void;
  setStopLoss: (value: string) => void;
  token: string;
  balance: number;
}) {
  function handleValueChange(val: boolean) {
    onChange(val);
    if (!value) {
      setTakeProfit('');
      setStopLoss('');
    }
  }

  const takeProfitPnl = useMemo(() => {
    return subtract(String(takeProfit), String(balance));
  }, [takeProfit, balance]);

  const takeProfitRoi = useMemo(() => {
    if (Number(takeProfitPnl) === 0) return 0;
    return truncateNumber(divide(String(takeProfitPnl), String(balance)), 4);
  }, [takeProfitPnl, balance]);

  const stopLossPnl = useMemo(() => {
    return subtract(String(stopLoss), String(balance));
  }, [stopLoss, balance]);

  const stopLossRoi = useMemo(() => {
    if (Number(stopLossPnl) === 0) return 0;
    return truncateNumber(divide(String(stopLossPnl), String(balance)), 4);
  }, [stopLossPnl, balance]);

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
