'use client';
import { logout } from '@/api/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const { push } = useRouter();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      push('/login');
    },
    onError: (error: Error) => {
      console.error('logout error:', error);
    }
  });

  const handleLogout = async () => {
    logoutMutation.mutate();
  };
  return <button onClick={handleLogout}>logout</button>;
}
