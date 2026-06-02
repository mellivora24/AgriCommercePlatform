import React, { type PropsWithChildren } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './auth.provider';
import { CartProvider } from './cart.provider';
import { QueryProvider } from './query.provider';

export const AppProvider: React.FC<PropsWithChildren> = ({
  children,
}) => (
  <QueryProvider>
    <AuthProvider>
      <CartProvider>
        {children}
        <Toaster />
      </CartProvider>
    </AuthProvider>
  </QueryProvider>
);
