'use client';

import Squares from '@/components/icons/squares';

import { SidebarContent } from './sidebar-content';
import { SidebarFooter } from './sidebar-footer';
import { SidebarHeader } from './sidebar-header';

export function Sidebar() {
  return (
    <div className="w-[300px] flex h-full bg-c-gray border-r border-c-border flex-col">
      <SidebarHeader />
      <SquaresWrapper />
      <SidebarContent />
      <SquaresWrapper />
      <SidebarFooter />
    </div>
  );
}

function SquaresWrapper() {
  return (
    <div className="w-full px-3">
      <Squares className="w-full h-[1px]" />
    </div>
  );
}
