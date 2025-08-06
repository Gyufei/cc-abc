import { useQuery } from '@tanstack/react-query';

import { ApiPath } from '@/lib/api/api-path';
import { Fetcher } from '@/lib/fetcher';

interface PublicKeyResponse {
  public_key: string;
  format: string;
}

export function usePublicKey() {
  const query = useQuery({
    queryKey: ['public-key'],
    queryFn: async (): Promise<string> => {
      const res = await Fetcher<PublicKeyResponse>(`${ApiPath.publicKey}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const publicKey = atob(res.public_key);

      return publicKey;
    },
  });

  return query;
}
