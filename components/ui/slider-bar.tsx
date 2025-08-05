'use client';

import { Slider } from 'radix-ui';

import * as React from 'react';

import { cn } from '@/lib/utils';

interface SliderBarProps {
  value?: number;
  max?: number;
  steps?: number;
  className?: string;
  showLabels?: boolean;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
}

export function SliderBar({
  value = 0,
  max = 100,
  steps = 5,
  className,
  showLabels = true,
  onValueChange,
  disabled = false,
}: SliderBarProps) {
  const [internalValue, setInternalValue] = React.useState([value]);

  // 同步外部值变化
  React.useEffect(() => {
    setInternalValue([value]);
  }, [value]);

  const handleValueChange = React.useCallback(
    (newValues: number[]) => {
      if (disabled) return;
      const clampedValue = Math.min(Math.max(newValues[0], 0), max);
      setInternalValue([clampedValue]);
      onValueChange?.(clampedValue);
    },
    [max, onValueChange, disabled]
  );

  // 生成步骤标记
  const stepMarks = Array.from({ length: steps }, (_, index) => {
    const stepValue = (index / (steps - 1)) * max;
    return {
      value: stepValue,
      index,
    };
  });

  return (
    <div className={cn('w-full', className || '')}>
      <div className="relative">
        {/* Radix Slider */}
        <Slider.Root
          className={cn(
            'relative flex w-full touch-none select-none items-center',
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          )}
          value={internalValue}
          onValueChange={handleValueChange}
          max={max}
          step={1}
          disabled={disabled}
        >
          {/* 轨道 */}
          <Slider.Track className="relative w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <Slider.Range className="absolute h-full bg-blue-500 rounded-full transition-all duration-300 ease-out" />
          </Slider.Track>

          {/* 滑块 */}
          <Slider.Thumb
            className={cn(
              'block w-4 h-4 bg-ui-bg-base border-ui-border-interactive border-[4px] rounded-full transition-all duration-300 hover:scale-110 focus:outline-none disabled:pointer-events-none disabled:opacity-50',
              value === 0
                ? 'translate-x-[-2px]'
                : value === max
                  ? 'translate-x-[2px]'
                  : 'translate-x-0'
            )}
          />

          {/* 步骤标记 */}
          <div className="absolute z-0 top-0 left-0 w-full h-1 flex justify-between items-center pointer-events-none">
            {stepMarks.map(({ value: stepValue, index }) => {
              const isActive = stepValue <= internalValue[0];

              return (
                <div
                  key={index}
                  className={cn(
                    'w-3 h-3 rounded-full border-[1.5px] transition-all duration-300 pointer-events-auto cursor-pointer hover:scale-110 flex items-center justify-center',
                    isActive
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-background border-ui-border-menu-top',
                    disabled ? 'cursor-not-allowed hover:scale-100' : ''
                  )}
                  onClick={() => {
                    if (!disabled) {
                      handleValueChange([stepValue]);
                    }
                  }}
                  role="button"
                  tabIndex={disabled ? -1 : 0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (!disabled) {
                        handleValueChange([stepValue]);
                      }
                    }
                  }}
                >
                  {isActive && <div className="w-[6px] h-[6px] bg-white rounded-full" />}
                </div>
              );
            })}
          </div>
        </Slider.Root>
      </div>

      {/* 标签 */}
      {showLabels && (
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>0</span>
          <span>{Math.round(internalValue[0])}%</span>
        </div>
      )}
    </div>
  );
}
