import React, { type PropsWithChildren, useEffect } from 'react';
import { useAuthStore } from '../store';

export const AuthProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  useEffect(() => {
    const storedAuthState = localStorage.getItem('auth-store');
    if (storedAuthState) {
      try {
        const authState = JSON.parse(storedAuthState);
        const { accessToken, refreshToken, user, isAuthenticated } =
          authState.state || authState;

        if (isAuthenticated && accessToken) {
          useAuthStore.setState({
            accessToken,
            refreshToken,
            user,
            isAuthenticated: true,
          });
        }
      } catch (error) {
        console.error('Failed to hydrate auth store:', error);
      }
    }
  }, []);

  return <>{children}</>;
};
