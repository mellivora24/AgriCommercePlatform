import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore, type User } from '../../store';
import { ROUTES } from '../routes';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: User['role'][];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
}) => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.HOME_PAGE} replace />;
  }

  return <>{children}</>;
};
