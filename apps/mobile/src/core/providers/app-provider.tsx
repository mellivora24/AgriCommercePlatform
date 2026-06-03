import React, { type PropsWithChildren, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './query-client';
import { useAuthStore, useCartStore } from '@/core/store';

export const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const authHydrated = useAuthStore((state) => state.isHydrated);
  const cartHydrated = useCartStore((state) => state.isHydrated);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(authHydrated && cartHydrated);
  }, [authHydrated, cartHydrated]);

  if (!ready) {
    return (
      <View
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f7f1' }}
      >
        <ActivityIndicator size="large" color="#15803d" />
      </View>
    );
  }

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
