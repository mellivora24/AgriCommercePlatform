import React, { type PropsWithChildren } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '@/core/store';
import { useCartStore } from '@/core/store';

export const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const authHydrated = useAuthStore((state) => state.isHydrated);
  const cartHydrated = useCartStore((state) => state.isHydrated);

  if (!authHydrated || !cartHydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f7f1' }}>
        <ActivityIndicator size="large" color="#15803d" />
      </View>
    );
  }

  return <>{children}</>;
};
