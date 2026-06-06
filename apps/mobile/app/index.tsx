import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/core/store';
import { useCartStore } from '@/core/store';
import { UserRole } from '@/core/types/enum';
import { ROUTES } from '@/core/router';

export default function IndexPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authHydrated = useAuthStore((state) => state.isHydrated);
  const cartHydrated = useCartStore((state) => state.isHydrated);
  const role = useAuthStore((state) => state.user?.role);

  if (!authHydrated || !cartHydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f7f1' }}>
        <ActivityIndicator size="large" color="#15803d" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href={ROUTES.LOGIN} />;
  }

  if (role === UserRole.SELLER) return <Redirect href={ROUTES.SELLER_DASHBOARD} />;
  if (role === UserRole.ADMIN) return <Redirect href={ROUTES.ADMIN_DASHBOARD} />;
  if (role === UserRole.SHIPPER) return <Redirect href={ROUTES.SHIPPER_DASHBOARD} />;

  return <Redirect href={ROUTES.BUYER_HOME} />;
}
