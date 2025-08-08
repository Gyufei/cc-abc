import { cn } from '@/lib/utils';

export function OrderFilter({
  options,
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  options: {
    label: string;
    value: string;
  }[];
}) {
  return (
    <div className="flex items-center gap-4">
      {options.map((option) => (
        <div
          key={option.value}
          className={cn(
            'py-1 px-2 smm-text rounded-md cursor-pointer',
            `${activeTab === option.value ? 'text-ui-fg-base' : 'text-ui-fg-muted'}`
          )}
          onClick={() => setActiveTab(option.value)}
          style={{
            boxShadow:
              activeTab === option.value
                ? '0px 0px 0px 1px rgba(0, 0, 0, 0.08),0px 1px 2px -1px rgba(0, 0, 0, 0.08),0px 2px 4px 0px rgba(0, 0, 0, 0.04)'
                : 'none',
          }}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
}
