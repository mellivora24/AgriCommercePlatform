import React from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/core/store';
import { UserRole } from '@/core/types/enum';
import { ROUTES } from '@/core/router';

const resolveHomeRoute = (role?: UserRole | null) => {
  if (role === UserRole.SELLER) {
    return ROUTES.SELLER_DASHBOARD;
  }

  if (role === UserRole.ADMIN) {
    return ROUTES.ADMIN_DASHBOARD;
  }

  if (role === UserRole.SHIPPER) {
    return ROUTES.SHIPPER_DASHBOARD;
  }

  return ROUTES.HOME_PAGE;
};

export default function IndexPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const role = useAuthStore((state) => state.user?.role);

  if (!isHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href={ROUTES.LOGIN} />;
  }

  return <Redirect href={resolveHomeRoute(role)} />;
}
