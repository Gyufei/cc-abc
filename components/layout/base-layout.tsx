import { Sidebar } from './sidebar/sidebar';

export function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-stretch h-screen min-h-[680px]">
      <Sidebar />
      {children}
    </div>
  );
}
