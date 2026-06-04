import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";
import { useCartStore } from "./cart-store";
import { queryClient } from "@/core/providers/query-client";
import type { UserRole } from "@/core/types/enum";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
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
  ) => Promise<void>;
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
      setAuth: async (accessToken, refreshToken, user) => {
        set({ accessToken, refreshToken, user, isAuthenticated: true });
        const cart = useCartStore.getState();
        cart.setIsGuest(false);
        await cart.mergeGuestCart();
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      },
      clearAuth: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
        const cart = useCartStore.getState();
        cart.clearCart();
        cart.setIsGuest(true);
        queryClient.removeQueries({ queryKey: ["cart"] });
      },
      setUser: (user) => set({ user }),
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          useAuthStore.setState({ isHydrated: true });
          if (state.isAuthenticated) {
            useCartStore.getState().setIsGuest(false);
          }
        }
      },
    },
  ),
);
