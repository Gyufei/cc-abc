import Image from 'next/image';

import ThreeDot from '@/components/icons/three-dot';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { useAppStore, useIsLogin, useUser } from '@/lib/store';

export function SidebarFooter() {
  const user = useUser();
  const isLogin = useIsLogin();
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const logout = useAppStore((state) => state.logout);

  const handleLogout = () => {
    logout();
  };

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
            <div className={`text-ui-fg-base smm-text transition-all duration-300 ease-in-out ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
              {user?.username}
            </div>
          </div>
          <div className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
            <Popover>
              <PopoverTrigger asChild>
                <ThreeDot className="w-[15px] h-[15px] cursor-pointer" />
              </PopoverTrigger>
              <PopoverContent className="w-32 p-1" align="end">
                <div
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-ui-fg-base hover:bg-ui-bg-base-hover rounded-md transition-colors"
                >
                  Logout
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
