import { Checkbox, Label } from '@medusajs/ui';

import { useState } from 'react';

import TriangleDown from '@/components/icons/triangle-down';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { TIME_IN_FORCE_TYPE } from '@/lib/types/trade';
import { cn } from '@/lib/utils';

const TimeInForceOptions = [
  { label: 'Good-Till-Cancel', value: 'GTC' },
  { label: 'Immediate-Or-Cancel', value: 'IOC' },
  { label: 'Fill-Or-Kill', value: 'FOK' },
];

export function TimeInForceSelect({
  timeInForce,
  onTimeInForceChange,
}: {
  timeInForce: TIME_IN_FORCE_TYPE;
  onTimeInForceChange: (value: TIME_IN_FORCE_TYPE) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function handleClickDrop() {
    if (timeInForce === 'PostOnly' && !isOpen) {
      return;
    }

    setIsOpen(!isOpen);
  }

  function handleTypeChange(type: TIME_IN_FORCE_TYPE) {
    onTimeInForceChange(type);
    setIsOpen(false);
  }

  function handlePostOnlyCheckChange(checked: boolean) {
    onTimeInForceChange(checked ? 'PostOnly' : 'GTC');
  }

  // 根据当前 cancelType 找到对应的显示文本
  const currentCancelType =
    TimeInForceOptions.find((item) => item.value === timeInForce) || TimeInForceOptions[0];

  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 flex items-center justify-center">
          <Checkbox
            disabled={timeInForce === 'IOC' || timeInForce === 'FOK'}
            checked={timeInForce === 'PostOnly'}
            onCheckedChange={handlePostOnlyCheckChange}
            id="Post-Only"
          />
        </div>
        <Label
          htmlFor="PostOnly"
          className={cn(
            'smm-text text-ui-fg-base',
            timeInForce !== 'PostOnly' ? 'text-ui-fg-muted' : ''
          )}
        >
          Post Only
        </Label>
      </div>
      <Popover open={isOpen} onOpenChange={handleClickDrop}>
        <PopoverTrigger asChild>
          <div
            onClick={handleClickDrop}
            className={cn(
              'flex items-center gap-x-2',
              timeInForce === 'PostOnly' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            )}
          >
            <span className="smm-text text-ui-fg-base">{currentCancelType.label}</span>
            <TriangleDown />
          </div>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[180px] p-2">
          <div className="smm-text">
            {TimeInForceOptions.map((item) => (
              <div
                key={item.value}
                onClick={() => handleTypeChange(item.value as TIME_IN_FORCE_TYPE)}
                className={cn(
                  'py-1 px-2 flex items-center gap-x-2 hover:bg-ui-bg-subtle-hover cursor-pointer smm-text',
                  timeInForce === item.value
                    ? 'bg-ui-bg-subtle-hover text-ui-fg-base'
                    : 'text-ui-fg-muted'
                )}
              >
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
