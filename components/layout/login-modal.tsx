'use client';

import { Button, FocusModal, Input, toast } from '@medusajs/ui';

import { useState } from 'react';

import { useLogin } from '@/lib/api/use-login';

export default function LoginModal() {
  const [open, setOpen] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { mutate, isPending } = useLogin();

  function handleLogin() {
    const usernameTrimmed = username.trim();
    const passwordTrimmed = password.trim();

    if (!usernameTrimmed) {
      toast.error('Username is required');
      return;
    }

    if (!passwordTrimmed) {
      toast.error('Password is required');
      return;
    }

    mutate({ username: usernameTrimmed, password: passwordTrimmed });
  }

  const isFormValid = username.trim() && password.trim();

  return (
    <FocusModal open={open} onOpenChange={() => setOpen(true)}>
      <FocusModal.Content
        className="inset-auto top-[50%] left-[50%] translate-x-[-50%] w-[400px] translate-y-[-50%]"
        overlayProps={{
          className: 'bg-background',
        }}
      >
        <FocusModal.Title>
          <div className="flex justify-between items-center border-ui-border-base border-b px-6 py-4">
            <span className="text-ui-fg-base text-base font-medium leading-6">Log in to AnyMM</span>
          </div>
        </FocusModal.Title>
        <FocusModal.Body className="flex flex-col py-4 px-6">
          <div className="flex flex-col items-stretch gap-y-2">
            <span className="text-ui-fg-base smm-text">Username</span>
            <Input
              className="w-full"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=""
              disabled={isPending}
            />
          </div>
          <div className="flex flex-col items-stretch gap-y-2 mt-4">
            <span className="text-ui-fg-base smm-text">Password</span>
            <Input
              className="w-full"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              disabled={isPending}
            />
          </div>

          <div className="mt-8">
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleLogin}
              disabled={!isFormValid || isPending}
              isLoading={isPending}
            >
              {isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
}
