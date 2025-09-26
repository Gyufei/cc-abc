import { ApiKeysBar } from './[...token-pair]/api-keys-bar';

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-1 bg-ui-bg-field overflow-auto h-full">
      <ApiKeysBar />
      {children}
    </div>
  );
}
