import { toast } from '@medusajs/ui';
import { useMutation } from '@tanstack/react-query';

import { Fetcher } from '../fetcher';
import { useAppStore } from '../store';
import { encryptPassword } from '../utils/crypto';
import { ApiPath } from './api-path';
import { usePublicKey } from './use-public-key';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user_id: string;
  username: string;
  token: string;
}

export function useLogin() {
  const { data: publicKey } = usePublicKey();
  const setUser = useAppStore((state) => state.setUser);

  const mutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      try {
        if (!publicKey) {
          throw new Error('Public key not found');
        }

        const encryptedPassword = await encryptPassword(credentials.password, publicKey);

        const params = {
          username: credentials.username,
          password: encryptedPassword,
        };

        return Fetcher<LoginResponse>(ApiPath.login, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        });
      } catch (e: unknown) {
        if (e instanceof Error) {
          const errorMessage =
            'message' in e ? (e as { message: string }).message : 'Unknown error';
          toast.error(errorMessage);
        } else {
          toast.error('Unknown error');
        }
      }
    },
    onSuccess: (data: LoginResponse | undefined) => {
      if (!data) {
        return;
      }

      setUser({
        user_id: data.user_id,
        username: data.username,
        token: data.token,
      });
    },
    onError: (error: Error) => {
      console.error('登录失败:', error.message);
    },
  });

  return mutation;
}
