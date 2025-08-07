'use client';

import Squares from '@/components/icons/squares';

import { useAppStore } from '@/lib/store';

import { SidebarContent } from './sidebar-content';
import { SidebarFooter } from './sidebar-footer';
import { SidebarHeader } from './sidebar-header';

export function Sidebar() {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);

  return (
    <div
      className={`
        flex h-full bg-ui-bg-field border-r border-ui-border-base flex-col
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'w-[300px] basis-[300px]' : 'w-[60px] basis-[60px]'}
      `}
    >
      <SidebarHeader />
      <SquaresWrapper />
      <SidebarContent />
      <SquaresWrapper />
      <SidebarFooter />
    </div>
  );
}

function SquaresWrapper() {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);

  return (
    <div
      className={`w-full px-3 transition-all duration-300 ease-in-out ${sidebarOpen ? 'px-3' : 'px-2'}`}
    >
      <Squares className="w-full h-[1px]" />
    </div>
  );
}
