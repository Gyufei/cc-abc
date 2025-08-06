import { toast } from '@medusajs/ui';
import { useMutation } from '@tanstack/react-query';

import { Fetcher } from '../fetcher';
import { useAppStore } from '../store';
import { encryptPassword } from '../utils/crypto';
import { ApiPath } from './api-path';
import { usePublicKey } from './use-public-key';

export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
}

export interface RegisterResponse {
  user_id: string;
  username: string;
  token: string;
}

export function useRegister() {
  const { data: publicKey } = usePublicKey();
  const setUser = useAppStore((state) => state.setUser);

  const mutation = useMutation({
    mutationFn: async (credentials: RegisterRequest) => {
      try {
        if (!publicKey) {
          throw new Error('Public key not found');
        }

        const encryptedPassword = await encryptPassword(credentials.password, publicKey);

        const params = {
          username: credentials.username,
          password: encryptedPassword,
          ...(credentials.email && { email: credentials.email }),
        };

        const res = Fetcher<RegisterResponse>(ApiPath.register, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        });

        return res;
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

    onSuccess: (data: RegisterResponse | undefined) => {
      if (!data) {
        return;
      }

      toast.success('Registration successful');

      setUser({
        user_id: data.user_id,
        username: data.username,
        token: data.token,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return mutation;
}
