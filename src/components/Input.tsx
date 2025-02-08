import React, { FC, InputHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  &:focus-within {
    label {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const Label = styled.label<{ $hasError?: boolean }>`
  font-size: 0.875rem;
  margin-bottom: 0.25rem;

  ${({ $hasError, theme }) =>
    $hasError &&
    css`
      color: ${theme.colors.danger};
    `};
`;

const StyledInput = styled.input<{ $hasError?: boolean }>`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.lightborder};
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
  font-size: 0.8125rem;
  font-family: var(--font-roboto);
  outline: none;
  height: 2.5rem;

  &:focus {
    border-color: ${({ theme }) => theme.colors.quaternary};
  }
`;

const FieldError = styled.p`
  margin: 0.25rem 0px 0px;
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.625rem;
`;

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errors?: string;
}

export const Input: FC<InputProps> = ({ label, errors, ...props }) => {
  return (
    <FieldWrapper>
      {label && (
        <Label htmlFor={props.name} $hasError={!!errors}>
          {label}
        </Label>
      )}
      <StyledInput {...props} $hasError={!!errors} />
      {errors && <FieldError>{errors}</FieldError>}
    </FieldWrapper>
  );
};
