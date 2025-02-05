import { LoginFormBody } from '@/types';
import { fetcher } from './ApiClient';

export const login = async ({ name, email }: LoginFormBody): Promise<void> => {
  await fetcher('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ name, email })
  });
};

export const logout = async (): Promise<void> => {
  await fetcher('/auth/logout', {
    method: 'POST'
  });
};
