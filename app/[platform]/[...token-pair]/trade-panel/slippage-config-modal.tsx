'use client';

import { Button, Checkbox, FocusModal, Label } from '@medusajs/ui';

import { useCallback, useState } from 'react';

import { SliderBar } from '@/components/ui/slider-bar';

interface SlippageConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (slippageData: {
    truncateSlippageChecked: boolean;
    warnSlippageChecked: boolean;
    truncateSlippage: number;
    warnSlippage: number;
  }) => void;
  initialSlippageData: {
    truncateSlippageChecked: boolean;
    warnSlippageChecked: boolean;
    truncateSlippage: number;
    warnSlippage: number;
  };
}

export function SlippageConfigModal({
  isOpen,
  onClose,
  onConfirm,
  initialSlippageData,
}: SlippageConfigModalProps) {
  const [slippageData, setSlippageData] = useState(initialSlippageData);

  const updateSlippageData = useCallback((updates: Partial<typeof slippageData>) => {
    setSlippageData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleConfirm = useCallback(() => {
    // enforce constraints before confirm
    const truncated = Math.min(Math.max(slippageData.truncateSlippage, 0.1), 5);
    const truncatedFixed = Math.round(truncated * 10) / 10;
    const warnedRaw = Math.min(Math.max(Math.floor(slippageData.warnSlippage), 1), 5);
    const payload = {
      ...slippageData,
      truncateSlippage: truncatedFixed,
      warnSlippage: warnedRaw,
    };
    onConfirm(payload);
    onClose();
  }, [onClose, onConfirm, slippageData]);

  const handleTruncateSliderChange = useCallback(
    (value: number) => {
      updateSlippageData({ truncateSlippage: value });
    },
    [updateSlippageData]
  );

  const handleWarnSliderChange = useCallback(
    (value: number) => {
      updateSlippageData({ warnSlippage: value });
    },
    [updateSlippageData]
  );

  return (
    <FocusModal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <FocusModal.Content
        className="order-preferences-dialog-content inset-auto top-[50%] left-[50%] translate-x-[-50%] w-[400px] translate-y-[-50%] z-50"
        overlayProps={{ className: 'z-30' }}
      >
        <FocusModal.Title>Slippage Preferences</FocusModal.Title>
        <FocusModal.Header className="order-preferences-header flex-row-reverse">
          <span className="text-ui-fg-base text-base font-medium leading-6">
            Slippage Preferences
          </span>
        </FocusModal.Header>
        <FocusModal.Body className="flex flex-col py-4 px-6 gap-y-8">
          <div className="flex flex-col gap-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="truncate-slippage-switch" className="smm-text text-ui-fg-base">
                Truncate slippage
              </Label>
              <div className="h-5 w-5 flex items-center justify-center">
                <Checkbox
                  checked={slippageData.truncateSlippageChecked}
                  onCheckedChange={(checked) =>
                    updateSlippageData({ truncateSlippageChecked: !!checked })
                  }
                  id="truncate-slippage-switch"
                />
              </div>
            </div>
            <div className="flex items-center justify-between w-full h-[32px] px-3 text-[14px] text-ui-fg-base bg-ui-bg-field border border-ui-border-base rounded-full">
              <span>{slippageData.truncateSlippage.toFixed(1)}</span>
              <span>%</span>
            </div>
            <div className="px-2 mt-2">
              <SliderBar
                value={Math.floor(slippageData.truncateSlippage)}
                max={5}
                steps={5}
                onValueChange={handleTruncateSliderChange}
                showLabels={false}
                disabled={!slippageData.truncateSlippageChecked}
              />
            </div>
          </div>

          <div className="flex flex-col gap-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="warn-slippage-switch" className="smm-text text-ui-fg-base">
                Warn slippage
              </Label>
              <div className="h-5 w-5 flex items-center justify-center">
                <Checkbox
                  checked={slippageData.warnSlippageChecked}
                  onCheckedChange={(checked) =>
                    updateSlippageData({ warnSlippageChecked: !!checked })
                  }
                  id="warn-slippage-switch"
                />
              </div>
            </div>
            <div className="flex items-center justify-between w-full h-[32px] px-3 text-[14px] text-ui-fg-base bg-ui-bg-field border border-ui-border-base rounded-full">
              <span>{Math.floor(slippageData.warnSlippage)}</span>
              <span>%</span>
            </div>
            <div className="px-2">
              <SliderBar
                value={Math.floor(slippageData.warnSlippage)}
                max={5}
                steps={5}
                onValueChange={handleWarnSliderChange}
                showLabels={false}
                disabled={!slippageData.warnSlippageChecked}
              />
            </div>
          </div>

          <div className="text-warning text-[14px] pt-4 mt-2 border-t border-ui-border-base">
            When enabled, each market order follows the slippage setting. It does not affect copy
            trading, bot orders, or chart orders.
          </div>
        </FocusModal.Body>
        <FocusModal.Footer>
          <Button variant="secondary" className="w-full" onClick={handleConfirm}>
            OK
          </Button>
          <Button variant="secondary" className="w-full" onClick={onClose}>
            Cancel
          </Button>
        </FocusModal.Footer>
      </FocusModal.Content>
    </FocusModal>
  );
}
