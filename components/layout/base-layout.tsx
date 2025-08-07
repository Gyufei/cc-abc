'use client';

import { Toaster } from '@medusajs/ui';

import { useIsLogin } from '@/lib/store';
import { cn } from '@/lib/utils';

import LoginModal from './login-modal';
import { Sidebar } from './sidebar/sidebar';

export function BaseLayout({ children }: { children: React.ReactNode }) {
  const isLogin = useIsLogin();

  return (
    <div
      className={cn(
        'flex items-stretch h-screen min-h-[680px]',
        isLogin ? 'bg-transparent' : 'bg-background'
      )}
    >
      {isLogin ? (
        <>
          <Sidebar />
          <div
            className={cn('flex-1 overflow-hidden transition-all duration-300 ease-in-out ml-0')}
          >
            {children}
          </div>
        </>
      ) : (
        <LoginModal />
      )}
      <Toaster position="top-right" />
    </div>
  );
}
