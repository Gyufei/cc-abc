'use client';

import { Button, Checkbox, FocusModal, Label } from '@medusajs/ui';

import { useCallback, useState } from 'react';

import { NumberInput } from '@/components/ui/number-input';

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
  const formatTruncateInput = (value: number) => {
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  };
  const [slippageData, setSlippageData] = useState(initialSlippageData);
  const [truncateInput, setTruncateInput] = useState(
    formatTruncateInput(initialSlippageData.truncateSlippage)
  );
  const [warnInput, setWarnInput] = useState(String(Math.floor(initialSlippageData.warnSlippage)));

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

  const handleTruncateChange = useCallback(
    (value: string) => {
      setTruncateInput(value);
      const num = Number(value);
      if (!Number.isNaN(num)) {
        updateSlippageData({ truncateSlippage: num });
      }
    },
    [updateSlippageData]
  );

  const handleTruncateBlur = useCallback(() => {
    const num = Number(truncateInput);
    const clamped = Math.min(Math.max(isNaN(num) ? 0.1 : num, 0.1), 5);
    const fixed = Number(clamped.toFixed(1));
    const newVal = Number.isInteger(fixed) ? String(fixed) : fixed.toFixed(1);
    setTruncateInput(newVal);
    updateSlippageData({ truncateSlippage: fixed });
  }, [truncateInput, updateSlippageData]);

  const handleWarnChange = useCallback(
    (value: string) => {
      setWarnInput(value);
      const num = Number(value);
      if (!Number.isNaN(num)) {
        updateSlippageData({ warnSlippage: num });
      }
    },
    [updateSlippageData]
  );

  const handleWarnBlur = useCallback(() => {
    const num = Number(warnInput);
    const base = isNaN(num) ? 1 : Math.floor(num);
    const clamped = Math.min(Math.max(base, 1), 5);
    const newVal = String(clamped);
    setWarnInput(newVal);
    updateSlippageData({ warnSlippage: clamped });
  }, [warnInput, updateSlippageData]);

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
            <div>
              <div
                className={`flex items-center justify-between w-full h-[32px] px-3 text-[14px] border rounded-full ${'border-ui-border-base'} ${!slippageData.truncateSlippageChecked ? 'bg-ui-bg-disabled' : 'bg-ui-bg-field'}`}
              >
                <NumberInput
                  value={truncateInput}
                  onChange={handleTruncateChange}
                  onBlur={handleTruncateBlur}
                  decimalPlaces={1}
                  disabled={!slippageData.truncateSlippageChecked}
                  bare
                  className={`bg-transparent w-full flex-1 outline-none focus:shadow-none focus:ring-0 px-0 ${
                    !slippageData.truncateSlippageChecked
                      ? 'text-ui-fg-muted placeholder:text-ui-fg-muted'
                      : 'text-ui-fg-base'
                  }`}
                  placeholder="0.1 - 5"
                />
                <span
                  className={
                    !slippageData.truncateSlippageChecked ? 'text-ui-fg-muted' : 'text-ui-fg-base'
                  }
                >
                  %
                </span>
              </div>
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
            <div>
              <div
                className={`flex items-center justify-between w-full h-[32px] px-3 text-[14px] border rounded-full ${'border-ui-border-base'} ${!slippageData.warnSlippageChecked ? 'bg-ui-bg-disabled' : 'bg-ui-bg-field'}`}
              >
                <NumberInput
                  value={warnInput}
                  onChange={handleWarnChange}
                  onBlur={handleWarnBlur}
                  decimalPlaces={0}
                  disabled={!slippageData.warnSlippageChecked}
                  bare
                  className={`bg-transparent w-full flex-1 outline-none focus:shadow-none focus:ring-0 px-0 ${
                    !slippageData.warnSlippageChecked
                      ? 'text-ui-fg-muted placeholder:text-ui-fg-muted'
                      : 'text-ui-fg-base'
                  }`}
                  placeholder="1 - 5"
                />
                <span
                  className={
                    !slippageData.warnSlippageChecked ? 'text-ui-fg-muted' : 'text-ui-fg-base'
                  }
                >
                  %
                </span>
              </div>
            </div>
          </div>

          {/* <div className="text-warning text-[14px] pt-4 mt-2 border-t border-ui-border-base">
            When enabled, each market order follows the slippage setting. It does not affect copy
            trading, bot orders, or chart orders.
          </div> */}
        </FocusModal.Body>
        <FocusModal.Footer>
          <Button
            variant="secondary"
            className="w-full bg-ui-green hover:bg-ui-green-hover active:bg-ui-green-active text-ui-bg-base shadow-none"
            onClick={handleConfirm}
          >
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
