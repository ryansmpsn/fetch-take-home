'use client';

import { login } from '@/api/routes';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { LoginFormBody } from '@/types';
import Button from './Button';

interface LoginFormValues {
  firstName: string;
  lastName: string;
  email: string;
}

const loginSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address')
});

export default function LoginForm() {
  const { push } = useRouter();

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange'
  });

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors }
  } = methods;

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginFormBody) => {
      await login(payload);
    },
    onSuccess: () => {
      push('/search');
    },
    onError: (error: Error) => {
      console.error('Login error:', error);
      setError('email', { message: 'Login failed. Please try again.' });
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    const name = `${data.firstName} ${data.lastName}`;
    const payload = { name, email: data.email };

    loginMutation.mutate(payload);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            type="text"
            placeholder="First name"
            {...register('firstName')}
          />
          {errors.firstName && <p>{errors.firstName.message}</p>}
        </div>
        <div>
          <input
            type="text"
            placeholder="Last name"
            {...register('lastName')}
          />
          {errors.lastName && <p>{errors.lastName.message}</p>}
        </div>
        <div>
          <input type="email" placeholder="Email" {...register('email')} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <button type="submit">Login</button>
      </form>
      <Button style="button">Click me</Button>
    </FormProvider>
  );
}
