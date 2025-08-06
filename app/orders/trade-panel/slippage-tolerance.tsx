import { Checkbox, Label } from '@medusajs/ui';

import { useState } from 'react';

import TriangleDown from '@/components/icons/triangle-down';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { cn } from '@/lib/utils';

const SLIPPAGE_OPTIONS = ['0.1', '0.5', '1', '2'];

export function SlippageTolerance({
  value,
  onChange,
  selectedSlippage,
  setSelectedSlippage,
  token,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
  selectedSlippage: string;
  setSelectedSlippage: (value: string) => void;
  token: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function handleValueChange(val: boolean) {
    onChange(val);
    if (!val) {
      setSelectedSlippage('');
    } else {
      setSelectedSlippage('0.1');
    }
  }

  function handleClickDrop() {
    if (!value && !isOpen) {
      return;
    }

    setIsOpen(!isOpen);
  }

  function handleSlippageChange(slippage: string) {
    setSelectedSlippage(slippage);
    setIsOpen(false);
  }

  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 flex items-center justify-center">
          <Checkbox checked={value} onCheckedChange={handleValueChange} id="slippage-tolerance" />
        </div>
        <Label htmlFor="slippage-tolerance" className="smm-text text-ui-fg-base">
          Slippage tolerance
        </Label>
      </div>
      <Popover open={isOpen} onOpenChange={handleClickDrop}>
        <PopoverTrigger asChild>
          {value && (
            <div
              onClick={handleClickDrop}
              className={cn('flex items-center gap-x-2 cursor-pointer')}
            >
              <span className="smm-text text-ui-fg-base">
                {selectedSlippage} {token || ''}
              </span>
              <TriangleDown />
            </div>
          )}
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[120px] p-2">
          <div className="smm-text">
            {SLIPPAGE_OPTIONS.map((option) => (
              <div
                key={option}
                onClick={() => handleSlippageChange(option)}
                className={cn(
                  'py-1 px-2 flex items-center gap-x-2 hover:bg-ui-bg-subtle-hover cursor-pointer smm-text',
                  selectedSlippage === option
                    ? 'bg-ui-bg-subtle-hover text-ui-fg-base'
                    : 'text-ui-fg-muted'
                )}
              >
                <span>
                  {option} {token}
                </span>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
