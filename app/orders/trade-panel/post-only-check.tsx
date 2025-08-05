import { Checkbox, Label } from '@medusajs/ui';

import { useState } from 'react';

import TriangleDown from '@/components/icons/triangle-down';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { CANCEL_TYPE } from '@/lib/types/trade';
import { cn } from '@/lib/utils';

const CANCEL_TYPES: CANCEL_TYPE[] = ['Good-Till-Cancel', 'Immediate-Or-Cancel', 'Fill-Or-Kill'];

export function PostOnlyCheck({
  value,
  onChange,
  cancelType,
  setCancelType,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
  cancelType: CANCEL_TYPE;
  setCancelType: (value: CANCEL_TYPE) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function handleClickDrop() {
    if (value && !isOpen) {
      return;
    }

    setIsOpen(!isOpen);
  }

  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 flex items-center justify-center">
          <Checkbox checked={value} onCheckedChange={onChange} id="Post-Only" />
        </div>
        <Label htmlFor="PostOnly" className="smm-text text-ui-fg-base">
          Post Only
        </Label>
      </div>
      <Popover open={isOpen} onOpenChange={handleClickDrop}>
        <PopoverTrigger asChild>
          <div
            onClick={handleClickDrop}
            className={cn(
              'flex items-center gap-x-2',
              value ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            )}
          >
            <span className="smm-text text-ui-fg-base">{cancelType}</span>
            <TriangleDown />
          </div>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[180px] p-2">
          <div className="smm-text">
            {CANCEL_TYPES.map((t) => (
              <div
                key={t}
                onClick={() => setCancelType(t)}
                className={cn(
                  'py-1 px-2 flex items-center gap-x-2 hover:bg-ui-bg-subtle-hover cursor-pointer smm-text',
                  cancelType === t ? 'bg-ui-bg-subtle-hover text-ui-fg-base' : 'text-ui-fg-muted'
                )}
              >
                <span>{t}</span>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
