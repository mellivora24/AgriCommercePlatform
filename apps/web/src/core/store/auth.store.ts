import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../constants';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'buyer' | 'seller' | 'admin';
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (accessToken: string, refreshToken: string, user: User) => void;
  clearAuth: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (accessToken, refreshToken, user) => {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN_KEY, refreshToken);
        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN_KEY);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN_KEY);
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },

      setUser: (user) => {
        set({ user });
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
