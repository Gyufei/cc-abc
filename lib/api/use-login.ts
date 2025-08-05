import { useMutation } from '@tanstack/react-query';

import { Fetcher } from '../fetcher';
import { useAppStore } from '../store';
import { ApiPath } from './api-path';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user_id: string;
  username: string;
  token: string;
}

// 登录 API 函数
async function loginApi(credentials: LoginRequest): Promise<LoginResponse> {
  return {
    user_id: 'mock_user_id',
    username: 'mock_username',
    token: 'mock_token',
  };

  return Fetcher<LoginResponse>(ApiPath.login, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
}

export function useLogin() {
  const setUser = useAppStore((state) => state.setUser);

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data: LoginResponse) => {
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
