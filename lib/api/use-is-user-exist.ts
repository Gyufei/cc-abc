import { useQuery } from '@tanstack/react-query';

import { ApiPath } from '@/lib/api/api-path';
import { Fetcher } from '@/lib/fetcher';

interface CheckUsernameResponse {
  exist: boolean;
}

export function useIsUserExist(username: string) {
  return useQuery({
    queryKey: ['is-user-exist', username],
    queryFn: async (): Promise<boolean> => {
      if (!username) return false;

      const res = await Fetcher<CheckUsernameResponse>(
        `${ApiPath.checkUsername}?username=${encodeURIComponent(username)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      // 兼容后端返回 true/false 或 { exist: true/false }
      if (typeof res === 'boolean') return res;
      return !!res.exist;
    },
    enabled: !!username,
  });
}
