'use client';

import { login } from '@/api/routes';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { LoginFormBody } from '@/types';
import Button from '../../components/Button';
import styled from 'styled-components';
import { Input } from '../../components/Input';

const StyledLoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 15rem;
  margin-inline: auto;

  @media ${({ theme: { device } }) => device.mobileM} {
    width: 100%;
  }
`;

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
      <StyledLoginForm onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          label="First name"
          placeholder="John"
          {...register('firstName')}
          errors={errors?.firstName?.message}
        />

        <Input
          type="text"
          label="Last name"
          placeholder="Doe"
          {...register('lastName')}
          errors={errors?.lastName?.message}
        />

        <Input
          type="email"
          label="Email"
          placeholder="example@gmail.com"
          {...register('email')}
          errors={errors?.email?.message}
        />

        <Button type="submit">Login</Button>
      </StyledLoginForm>
    </FormProvider>
  );
}
