'use client';

import { Button, FocusModal, Input } from '@medusajs/ui';

import { useState } from 'react';

import { useIsUserExist } from '@/lib/api/use-is-user-exist';
import { useLogin } from '@/lib/api/use-login';
import { useRegister } from '@/lib/api/use-register';

export default function LoginModal() {
  const [open, setOpen] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { mutate: login, isPending: isLoginPending } = useLogin();
  const { mutate: register, isPending: isRegisterPending } = useRegister();

  const isFormValid = username.trim() && password.trim();

  const { data: isUsernameExists } = useIsUserExist(username.trim());

  function checkPasswordValid() {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
    };

    if (!requirements.length) {
      setPasswordError(
        ' inputsPassword has to be between 8-30 characters, and contains at least oneuppercase letter, one lowercase letter and a number '
      );
      return false;
    }

    setPasswordError('');
    return true;
  }

  function handleConfirm() {
    if (isUsernameExists) {
      handleLogin();
    } else {
      handleRegister();
    }
  }

  function handleLogin() {
    const usernameTrimmed = username.trim();
    const passwordTrimmed = password.trim();
    login({ username: usernameTrimmed, password: passwordTrimmed });
  }

  function handleRegister() {
    if (!checkPasswordValid()) {
      return;
    }

    const usernameTrimmed = username.trim();
    const passwordTrimmed = password.trim();

    register({ username: usernameTrimmed, password: passwordTrimmed });
  }

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
              disabled={isLoginPending || isRegisterPending}
            />
          </div>
          <div className="flex flex-col items-stretch gap-y-2 mt-4">
            <span className="text-ui-fg-base smm-text">Password</span>
            <Input
              className="w-full"
              type="password"
              aria-invalid={!!passwordError}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              disabled={isLoginPending || isRegisterPending}
            />
            <span>
              {passwordError && <span className="text-ui-fg-error smm-text">{passwordError}</span>}
            </span>
          </div>

          <div className="mt-8">
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleConfirm}
              disabled={!isFormValid || isLoginPending || isRegisterPending}
              isLoading={isLoginPending || isRegisterPending}
            >
              {isLoginPending
                ? 'Logging in...'
                : isRegisterPending
                  ? 'Signing up...'
                  : 'Log In / Sign Up'}
            </Button>
          </div>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
}
