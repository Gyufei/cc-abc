import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

import Collapse from '../../icons/collapse';
import Logo from '../../icons/logo';

export function SidebarHeader() {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  return (
    <div
      className={cn(
        'flex items-center',
        sidebarOpen
          ? 'h-[52px] flex-row px-3 justify-between '
          : 'h-fit flex-col justify-start gap-y-3 py-3'
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 flex items-center justify-center rounded-[6px]"
          style={{
            boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.12),0px 0px 0px 1px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Logo className="w-5 h-5" />
        </div>
        <span
          className={`smm-text text-ui-fg-base transition-all duration-300 ease-in-out ${sidebarOpen ? 'inline-block' : 'hidden'}`}
        >
          AnyMM
        </span>
      </div>
      <Collapse
        className="h-[15px] w-[15px] cursor-pointer transition-transform duration-300 ease-in-out hover:opacity-80"
        onClick={toggleSidebar}
        style={{ transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}
      />
    </div>
  );
}
