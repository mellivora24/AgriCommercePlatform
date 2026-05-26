import React, { type PropsWithChildren } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
    },
  },
});

export const QueryProvider: React.FC<PropsWithChildren> = ({
  children,
}) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

export { queryClient };
