import { Alert, Badge, Button, Checkbox, FocusModal, Label } from '@medusajs/ui';

import { useState } from 'react';

import TriangleDown from '@/components/icons/triangle-down';

import { cn } from '@/lib/utils';

export function OrderByTokenSelect({
  baseCoin,
  quoteCoin,
  marketUnitToken,
  setMarketUnit,
}: {
  baseCoin: string;
  quoteCoin: string;
  marketUnitToken: string;
  setMarketUnit: (unit: string) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [innerMU, setInnerMu] = useState(marketUnitToken);

  function handleOk() {
    setMarketUnit(innerMU);
    setModalOpen(false);
  }

  function handleCancel() {
    setModalOpen(false);
  }

  return (
    <FocusModal open={modalOpen} onOpenChange={setModalOpen}>
      <FocusModal.Trigger className="absolute right-2 top-1/2 -translate-y-1/2">
        <Badge size="2xsmall" className=" flex items-center gap-x-1 px-1 cursor-pointer">
          <span>{marketUnitToken || '-'}</span>
          <TriangleDown className="translate-y-[-2px]" />
        </Badge>
      </FocusModal.Trigger>
      <FocusModal.Content
        className="order-preferences-dialog-content inset-auto top-[50%] left-[50%] translate-x-[-50%] w-[400px] translate-y-[-50%] z-50"
        overlayProps={{ className: 'z-30' }}
      >
        <FocusModal.Title>Order Preferences</FocusModal.Title>
        <FocusModal.Header className="order-preferences-header flex-row-reverse">
          <span className="text-ui-fg-base text-base font-medium leading-6">Order Preferences</span>
        </FocusModal.Header>
        <FocusModal.Body className="flex flex-col py-4 px-6 gap-y-4">
          <div className="flex items-center gap-x-2">
            <div className="h-5 w-5 flex items-center justify-center">
              <Checkbox
                checked={innerMU === baseCoin}
                onCheckedChange={() => setInnerMu(baseCoin)}
                id="order-by-qty"
              />
            </div>
            <Label
              htmlFor="order-by-qty"
              className={cn(
                'smm-text text-ui-fg-base',
                innerMU !== baseCoin ? 'text-ui-fg-muted' : ''
              )}
            >
              Order by Qty ({baseCoin})
            </Label>
          </div>
          <div className="flex items-center gap-x-2">
            <div className="h-5 w-5 flex items-center justify-center">
              <Checkbox
                checked={innerMU === quoteCoin}
                onCheckedChange={() => setInnerMu(quoteCoin)}
                id="order-by-value"
              />
            </div>
            <Label
              htmlFor="order-by-value"
              className={cn(
                'smm-text text-ui-fg-base',
                innerMU !== quoteCoin ? 'text-ui-fg-muted' : ''
              )}
            >
              Order by Value ({quoteCoin})
            </Label>
          </div>
          <Alert variant="info" className="smm-text">
            Place orders by quantity or value based on your preferences. The final fill price and
            amount will depend on actual market conditions. The maximum order size (by quantity or
            value) allowed is limited by market depth, and may be lower than the maximum buy or sell
            amount available.
          </Alert>
        </FocusModal.Body>
        <FocusModal.Footer>
          <Button
            variant="secondary"
            className="w-full bg-ui-green hover:bg-ui-green-hover active:bg-ui-green-active text-ui-bg-base shadow-none"
            onClick={handleOk}
          >
            OK
          </Button>
          <Button variant="secondary" className="w-full" onClick={handleCancel}>
            Cancel
          </Button>
        </FocusModal.Footer>
      </FocusModal.Content>
    </FocusModal>
  );
}
