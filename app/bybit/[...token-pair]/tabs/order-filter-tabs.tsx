export function OrderFilterTabs({
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
    <div className="flex flex-row gap-2">
      {options.map((option) => (
        <div
          key={option.value}
          className={`${activeTab === option.value ? 'bg-ui-bg-subtle' : ''}`}
          onClick={() => setActiveTab(option.value)}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
}
