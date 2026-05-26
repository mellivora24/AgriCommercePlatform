import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  sellerId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku?: string;
}

interface CartState {
  items: CartItem[];
  totalCount: number;
  isGuest: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setItems: (items: CartItem[]) => void;
  clearCart: () => void;
  setIsGuest: (isGuest: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalCount: 0,
      isGuest: true,

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.productId === item.productId,
          );

          let newItems: CartItem[];
          if (existingItem) {
            newItems = state.items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i,
            );
          } else {
            newItems = [...state.items, item];
          }

          return {
            items: newItems,
            totalCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
          };
        }),

      removeItem: (productId) =>
        set((state) => {
          const newItems = state.items.filter(
            (i) => i.productId !== productId,
          );
          return {
            items: newItems,
            totalCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
          };
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return state;
          }

          const newItems = state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          );

          return {
            items: newItems,
            totalCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
          };
        }),

      setItems: (items) =>
        set({
          items,
          totalCount: items.reduce((sum, i) => sum + i.quantity, 0),
        }),

      clearCart: () =>
        set({
          items: [],
          totalCount: 0,
        }),

      setIsGuest: (isGuest) => set({ isGuest }),
    }),
    {
      name: 'cart-store',
      partialize: (state) => ({
        items: state.items,
        isGuest: state.isGuest,
      }),
    },
  ),
);
