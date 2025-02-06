import React, { FC, InputHTMLAttributes } from 'react';
import styled from 'styled-components';

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledInput = styled.input`
  padding: 0.9375rem;
  border: 1px solid ${({ theme }) => theme.colors.lightborder};
  border-radius: 3px;
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

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errors?: string;
}

export const Input: FC<InputProps> = ({ errors, ...props }) => {
  return (
    <FieldWrapper>
      <StyledInput {...props} />
      {errors && <FieldError>{errors}</FieldError>}
    </FieldWrapper>
  );
};
