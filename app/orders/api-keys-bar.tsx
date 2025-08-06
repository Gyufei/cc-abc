'use client';

import Image from 'next/image';

import { useApiKeys } from '@/lib/api/use-api-keys';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function ApiKeysBar() {
  const { data: apiKeys } = useApiKeys();
  const { currentApiKeyId, setCurrentApiKeyId } = useAppStore();

  function handleClick(apiKeyId: string) {
    if (apiKeyId === currentApiKeyId) {
      return;
    }

    setCurrentApiKeyId(apiKeyId);
  }

  return (
    <div className="h-10 border-b border-ui-border-base flex items-center">
      {apiKeys?.map((key) => {
        return (
          <div
            key={key.id}
            className={cn(
              'flex h-10 items-center border-r border-ui-border-base gap-x-2 px-4 cursor-pointer',
              key.id === currentApiKeyId ? 'bg-ui-bg-base' : 'bg-transparent'
            )}
            onClick={() => handleClick(key.id)}
          >
            <div
              className="h-5 w-5 flex items-center justify-center"
              style={{
                boxShadow:
                  '0px 1px 2px 0px rgba(0, 0, 0, 0.12),0px 0px 0px 1px rgba(0, 0, 0, 0.08)',
              }}
            >
              <Image
                src={`/icons/${key.platform}.svg`}
                alt={key.platform}
                width={16}
                height={16}
                className="rounded-xs"
              />
            </div>
            <span className="text-ui-text-base smm-text">{key.account_name}</span>
          </div>
        );
      })}
    </div>
  );
}
