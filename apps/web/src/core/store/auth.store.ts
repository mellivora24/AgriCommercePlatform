import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "BUYER" | "SELLER" | "ADMIN";
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;

  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;

  setAuth: (
    accessToken: string,
    refreshToken: string,
    user: User,
  ) => void;

  clearAuth: () => void;

  setUser: (user: User) => void;

  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,

      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,

      setAuth: (accessToken, refreshToken, user) => {
        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
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

      setHydrated: (hydrated) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: "auth-store",

      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),

      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
