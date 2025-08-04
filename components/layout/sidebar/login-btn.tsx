import { Button, FocusModal, IconButton, Input, Kbd } from '@medusajs/ui';

import { useState } from 'react';

import XMark from '@/components/icons/x-mark';

export default function LoginBtn() {
  const [open, setOpen] = useState(false);

  return (
    <FocusModal open={open} onOpenChange={setOpen}>
      <FocusModal.Trigger asChild>
        <Button variant="secondary" size="small">
          Log In
        </Button>
      </FocusModal.Trigger>
      <FocusModal.Content className="inset-auto top-[50%] left-[50%] translate-x-[-50%] w-[400px] translate-y-[-50%]">
        <div className="flex justify-between items-center border-ui-border-base border-b px-6 py-4">
          <span className="text-ui-fg-base text-base font-medium leading-6">Log in to AnyMM</span>

          <div className="flex items-center gap-x-2">
            <Kbd>esc</Kbd>
            <IconButton
              size="small"
              type="button"
              variant="transparent"
              onClick={() => setOpen(false)}
            >
              <XMark />
            </IconButton>
          </div>
        </div>
        <FocusModal.Body className="flex flex-col py-4 px-6">
          <div className="flex flex-col items-stretch gap-y-2">
            <span className="text-ui-fg-base text-[13px] font-normal leading-5">Username</span>
            <Input className="w-full" id="username" />
          </div>
          <div className="flex flex-col items-stretch gap-y-2 mt-4">
            <span className="text-ui-fg-base text-[13px] font-normal leading-5">Password</span>
            <Input className="w-full" id="password" />
          </div>

          <div className="mt-8">
            <Button variant="secondary" className="w-full">
              Sign In
            </Button>
          </div>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
}
