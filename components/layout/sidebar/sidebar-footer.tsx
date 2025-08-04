import Image from 'next/image';

import ThreeDot from '@/components/icons/three-dot';

import { isUserLogin, useAppStore } from '@/lib/store';

import LoginBtn from './login-btn';

export function SidebarFooter() {
  const user = useAppStore((state) => state.user);
  const isLogin = useAppStore(isUserLogin);

  return (
    <div className="h-[56px] p-3 flex items-center justify-between">
      {isLogin ? (
        <>
          <div className="flex gap-2">
            <div
              className="w-5 h-5 flex items-center justify-center bg-background rounded-full"
              style={{
                boxShadow:
                  '0px 1px 2px 0px rgba(0, 0, 0, 0.12),0px 0px 0px 1px rgba(0, 0, 0, 0.08)',
              }}
            >
              <Image src="/images/avatar-place.png" alt="avatar" width={16} height={16} />
            </div>
            <div className="text-ui-fg-base text-[13px] font-medium leading-5">{user?.name}</div>
          </div>
          <ThreeDot className="w-[15px] h-[15px] cursor-pointer" />
        </>
      ) : (
        <LoginBtn />
      )}
    </div>
  );
}
