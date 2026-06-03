import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';

export interface CartItem {
  productId: number;
  sellerId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku?: string;
}

export interface CartResponse {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

interface CartState {
  items: CartItem[];
  isGuest: boolean;
  isHydrated: boolean;
  addItem: (item: CartItem) => void;
  updateItem: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  setIsGuest: (isGuest: boolean) => void;
  mergeGuestCart: () => Promise<void>;
  setHydrated: (hydrated: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isGuest: true,
      isHydrated: false,
      addItem: (item) => {
        const items = [...get().items];
        const index = items.findIndex((current) => current.productId === item.productId);

        if (index >= 0) {
          items[index] = {
            ...items[index],
            quantity: items[index].quantity + item.quantity,
          };
        } else {
          items.push(item);
        }

        set({ items });
      },
      updateItem: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
        });
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.productId !== productId) });
      },
      clearCart: () => set({ items: [] }),
      setIsGuest: (isGuest) => set({ isGuest }),
      mergeGuestCart: async () => {
        set((state) => ({ items: [...state.items] }));
      },
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: 'cart-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ items: state.items, isGuest: state.isGuest }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
