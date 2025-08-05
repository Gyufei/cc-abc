import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

import Trade from '../../icons/trade';

export function SidebarContent() {
  const pathname = usePathname();

  const isOrder = pathname.includes('/orders');
  const isTrade = isOrder;

  return (
    <div className="p-3 flex-1">
      <div className="flex flex-col gap-[2px]">
        <SidebarLinkItem
          isActive={isTrade}
          icon={<Trade className="w-[15px] h-[15px]" />}
          label="Trade"
        />
        <SidebarLinkSubItem isActive={isOrder} label="Orders" />
      </div>
    </div>
  );
}

function SidebarLinkItem({
  isActive,
  icon,
  label,
}: {
  isActive: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div
      className={cn(
        'py-[2px] flex items-center gap-2',
        isActive
          ? 'bg-background text-ui-fg-base'
          : 'bg-transparent  hover:bg-ui-bg-subtle-hover text-ui-fg-subtle'
      )}
    >
      <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
      <span className="smm-text">{label}</span>
    </div>
  );
}

function SidebarLinkSubItem({ isActive, label }: { isActive: boolean; label: string }) {
  return (
    <div
      className={cn(
        'py-[2px] h-7 flex items-center gap-2 ml-[26px] pl-1',
        isActive
          ? 'bg-background text-ui-fg-base'
          : 'bg-transparent hover:bg-ui-bg-subtle-hover text-ui-fg-subtle'
      )}
    >
      <span className="smm-text">{label}</span>
    </div>
  );
}
