import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { ROUTES } from '../routes';

interface GuestGuardProps {
  children: React.ReactNode;
}

export const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME_PAGE} replace />;
  }

  return <>{children}</>;
};
