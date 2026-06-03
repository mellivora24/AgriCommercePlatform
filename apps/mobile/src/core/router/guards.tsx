import React, { type PropsWithChildren } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { ROUTES } from './routes';
import { useAuthStore } from '@/core/store';
import { UserRole } from '@/core/types/enum';

const LoadingGate = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f7f1' }}>
    <ActivityIndicator size="large" color="#15803d" />
  </View>
);

export const AuthGate: React.FC<PropsWithChildren> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  if (!isHydrated) {
    return <LoadingGate />;
  }

  if (!isAuthenticated) {
    return <Redirect href={ROUTES.LOGIN} />;
  }

  return <>{children}</>;
};

export const GuestGate: React.FC<PropsWithChildren> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  if (!isHydrated) {
    return <LoadingGate />;
  }

  if (isAuthenticated) {
    return <Redirect href={ROUTES.HOME_PAGE} />;
  }

  return <>{children}</>;
};

export const RoleGate: React.FC<PropsWithChildren<{ allowedRoles: UserRole[] }>> = ({
  children,
  allowedRoles,
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const userRole = useAuthStore((state) => state.user?.role);

  if (!isHydrated) {
    return <LoadingGate />;
  }

  if (!isAuthenticated) {
    return <Redirect href={ROUTES.LOGIN} />;
  }

  if (!userRole || !allowedRoles.includes(userRole as UserRole)) {
    return <Redirect href={ROUTES.HOME_PAGE} />;
  }

  return <>{children}</>;
};
