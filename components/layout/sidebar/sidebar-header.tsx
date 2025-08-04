import Collapse from '../../icons/collapse';
import Logo from '../../icons/logo';

export function SidebarHeader() {
  return (
    <div className="h-[52px] flex justify-between items-center px-3">
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 flex items-center justify-center rounded-[6px]"
          style={{
            boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.12),0px 0px 0px 1px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Logo className="w-5 h-5" />
        </div>
        <span className="text-[13px] font-medium text-c-black leading-5">AnyMM</span>
      </div>
      <Collapse className="h-[15px] w-[15px] cursor-pointer" />
    </div>
  );
}
