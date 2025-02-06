'use client';

import { login } from '@/api/routes';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { LoginFormBody } from '@/types';
import Button from './Button';
import styled from 'styled-components';

const StyledLoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 15rem;
  margin-inline: auto;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledInput = styled.input`
  padding: 0.9375rem;
  border: 1px solid ${({ theme }) => theme.colors.lightborder};
  border-radius: 3px;
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
  font-size: 0.8125rem;
  font-family: var(--font-roboto);
`;

const FieldError = styled.p`
  margin: 0px;
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.625rem;
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
        <FieldWrapper>
          <StyledInput
            type="text"
            placeholder="First name"
            {...register('firstName')}
          />
          {errors.firstName && (
            <FieldError>{errors.firstName.message}</FieldError>
          )}
        </FieldWrapper>
        <FieldWrapper>
          <StyledInput
            type="text"
            placeholder="Last name"
            {...register('lastName')}
          />
          {errors.lastName && (
            <FieldError>{errors.lastName.message}</FieldError>
          )}
        </FieldWrapper>
        <FieldWrapper>
          <StyledInput
            type="email"
            placeholder="Email"
            {...register('email')}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </FieldWrapper>

        <Button type="submit">Login</Button>
      </StyledLoginForm>
    </FormProvider>
  );
}
