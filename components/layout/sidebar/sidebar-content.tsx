import { usePathname } from 'next/navigation';

import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

import Trade from '../../icons/trade';

export function SidebarContent() {
  const pathname = usePathname();
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);

  const isOrder = pathname.includes('/orders');
  const isTrade = isOrder;

  return (
    <div className="p-3 flex-1">
      <div
        className={cn('flex flex-col gap-[2px]', sidebarOpen ? 'items-stretch' : 'items-center')}
      >
        <SidebarLinkItem
          isActive={isTrade}
          icon={<Trade className="w-[15px] h-[15px]" />}
          label="Trade"
          sidebarOpen={sidebarOpen}
        />
        <SidebarLinkSubItem isActive={isOrder} label="Orders" sidebarOpen={sidebarOpen} />
      </div>
    </div>
  );
}

function SidebarLinkItem({
  isActive,
  icon,
  label,
  sidebarOpen,
}: {
  isActive: boolean;
  icon: React.ReactNode;
  label: string;
  sidebarOpen: boolean;
}) {
  return (
    <div
      className={cn(
        'py-[2px] flex items-center gap-2',
        isActive
          ? 'bg-background text-ui-fg-base'
          : 'bg-transparent  hover:bg-ui-bg-subtle-hover text-ui-fg-subtle',
        sidebarOpen ? 'gap-2' : 'gap-0'
      )}
    >
      <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
      <span
        className={`smm-text transition-all duration-300 ease-in-out ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}
      >
        {label}
      </span>
    </div>
  );
}

function SidebarLinkSubItem({
  isActive,
  label,
  sidebarOpen,
}: {
  isActive: boolean;
  label: string;
  sidebarOpen: boolean;
}) {
  return (
    <div
      className={cn(
        'py-[2px] h-7 flex items-center gap-2 transition-all duration-300 ease-in-out',
        sidebarOpen ? 'ml-[26px] pl-1' : 'ml-0 pl-0',
        isActive
          ? 'bg-background text-ui-fg-base'
          : 'bg-transparent hover:bg-ui-bg-subtle-hover text-ui-fg-subtle'
      )}
    >
      <span
        className={`smm-text transition-all duration-300 ease-in-out ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}
      >
        {label}
      </span>
    </div>
  );
}
