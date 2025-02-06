'use client';

import type React from 'react';
import styled, { css } from 'styled-components';

export type ButtonProps = {
  children?: React.ReactNode | string | number;
  type?: 'button' | 'reset' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

const StyledButton = styled.button<ButtonProps>`
  border: none;
  display: inline-flex;
  padding: 0.5rem 1rem;
  width: fit-content;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.1);
  transition: background-color 0.25s, color 0.25s;

  ${({ theme: { colors } }) => css`
    background-color: ${colors.primary};
    color: ${colors.white};
  `};

  a {
    color: inherit;
    text-decoration: none;
    &:hover,
    &:focus {
      box-shadow: none;
      color: inherit;
    }
  }

  &:hover {
    ${({ theme: { colors } }) => css`
      background-color: ${colors.white};
      color: ${colors.primary};
    `};
  }

  &:disabled {
    cursor: not-allowed;
    ${({ theme: { colors } }) => css`
      background-color: ${colors.muted};
      color: ${colors.white};
    `};
  }
`;

const InnerWrapper = styled.span`
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.25;
  position: relative;
  top: 1px;
  font-family: var(--font-roboto);
`;

function Button({ children, className, ...props }: ButtonProps) {
  const buttonProps = {
    type: props.type ?? 'button',
    onClick: props.onClick,
    disabled: props.disabled ?? false,
    role: 'button',
    'aria-disabled': props.disabled,
    className: className
  };

  return (
    <StyledButton aria-label={`${buttonProps.type}-button`} {...buttonProps}>
      <InnerWrapper>{children}</InnerWrapper>
    </StyledButton>
  );
}

export default Button;
