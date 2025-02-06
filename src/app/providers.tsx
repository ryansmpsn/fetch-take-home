'use client';

import type React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../styles/Theme';

import StyledComponentsRegistry from '@/lib/registry';

const queryClient = new QueryClient();

function Providers({ children }: React.PropsWithChildren) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={defaultTheme}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}

export default Providers;
