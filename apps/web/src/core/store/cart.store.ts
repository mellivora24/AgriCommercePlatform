import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartApi } from "@/features/cart/data/api/cart.api";

export interface CartItemProduct {
  productId: number;
  name: string;
  price: number;
  stockQuantity: number;
  images: { imageId: number; url: string }[];
  seller: { storeName: string };
}

export interface CartItem {
  itemId: number;
  productId: number;
  quantity: number;
  product: CartItemProduct;
}

export interface CartResponse {
  cartId: number;
  items: CartItem[];
}

export interface GuestCartItem {
  productId: number;
  sellerId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku?: string;
}

interface CartState {
  cartId: number | null;
  items: CartItem[];
  guestItems: GuestCartItem[];
  totalCount: number;
  isGuest: boolean;
  isSyncing: boolean;

  addItem: (item: GuestCartItem) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  fetchFromServer: () => Promise<void>;
  mergeGuestCart: () => Promise<void>;
  clearCart: () => void;
  setIsGuest: (isGuest: boolean) => void;
}

function applyCartResponse(
  response: CartResponse,
): Pick<CartState, "cartId" | "items" | "totalCount"> {
  const items = Array.isArray(response.items) ? response.items : [];
  return {
    cartId: response.cartId,
    items,
    totalCount: items.reduce((sum, i) => sum + i.quantity, 0),
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartId: null,
      items: [],
      guestItems: [],
      totalCount: 0,
      isGuest: true,
      isSyncing: false,

      clearCart: () =>
        set({ cartId: null, items: [], guestItems: [], totalCount: 0 }),

      setIsGuest: (isGuest) => set({ isGuest }),

      fetchFromServer: async () => {
        set({ isSyncing: true });
        try {
          const data = await cartApi.getCartItems();
          set(applyCartResponse(data));
        } finally {
          set({ isSyncing: false });
        }
      },

      mergeGuestCart: async () => {
        const { guestItems } = get();
        if (guestItems.length === 0) return;

        set({ isSyncing: true });
        try {
          let lastResponse: CartResponse | null = null;
          for (const item of guestItems) {
            lastResponse = await cartApi.addToCart({
              productId: item.productId,
              quantity: item.quantity,
            });
          }
          if (lastResponse) set(applyCartResponse(lastResponse));
          set({ guestItems: [] });
        } finally {
          set({ isSyncing: false });
        }
      },

      addItem: async (item) => {
        if (get().isGuest) {
          set((state) => {
            const existing = state.guestItems.find(
              (i) => i.productId === item.productId,
            );
            const newGuest = existing
              ? state.guestItems.map((i) =>
                  i.productId === item.productId
                    ? { ...i, quantity: i.quantity + item.quantity }
                    : i,
                )
              : [...state.guestItems, item];

            return {
              guestItems: newGuest,
              totalCount: newGuest.reduce((sum, i) => sum + i.quantity, 0),
            };
          });
        } else {
          set({ isSyncing: true });
          try {
            const data = await cartApi.addToCart({
              productId: item.productId,
              quantity: item.quantity,
            });
            set(applyCartResponse(data));
          } finally {
            set({ isSyncing: false });
          }
        }
      },

      removeItem: async (itemId) => {
        if (get().isGuest) {
          set((state) => {
            const newGuest = state.guestItems.filter(
              (i) => i.productId !== itemId,
            );
            return {
              guestItems: newGuest,
              totalCount: newGuest.reduce((sum, i) => sum + i.quantity, 0),
            };
          });
        } else {
          set({ isSyncing: true });
          try {
            const data = await cartApi.removeFromCart({ itemId });
            set(applyCartResponse(data));
          } finally {
            set({ isSyncing: false });
          }
        }
      },

      updateQuantity: async (productId, quantity) => {
        if (quantity <= 0) return;

        if (get().isGuest) {
          set((state) => {
            const newGuest = state.guestItems.map((i) =>
              i.productId === productId ? { ...i, quantity } : i,
            );
            return {
              guestItems: newGuest,
              totalCount: newGuest.reduce((sum, i) => sum + i.quantity, 0),
            };
          });
        } else {
          set({ isSyncing: true });
          try {
            const data = await cartApi.updateCartItem({ productId, quantity });
            set(applyCartResponse(data));
          } finally {
            set({ isSyncing: false });
          }
        }
      },
    }),
    {
      name: "cart-store",
      partialize: (state) => ({
        guestItems: state.guestItems,
        isGuest: state.isGuest,
      }),
    },
  ),
);
