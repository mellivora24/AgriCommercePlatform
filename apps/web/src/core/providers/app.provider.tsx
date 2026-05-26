import React, { type PropsWithChildren } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryProvider } from './query.provider';
import { AuthProvider } from './auth.provider';
import { CartProvider } from './cart.provider';

export const AppProvider: React.FC<PropsWithChildren> = ({
  children,
}) => (
  <QueryProvider>
    <AuthProvider>
      <CartProvider>
        {children}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </CartProvider>
    </AuthProvider>
  </QueryProvider>
);
