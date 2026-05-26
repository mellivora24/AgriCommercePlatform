import { useCartStore } from '../store';
import { STORAGE_KEYS } from '../constants';

export const cartMergeService = {
  mergeGuestCartToServer: async (mergeFunction: (items: any[]) => Promise<void>) => {
    const guestCartState = localStorage.getItem('cart-store');
    if (guestCartState) {
      try {
        const cartState = JSON.parse(guestCartState);
        const items = cartState.state?.items || cartState.items || [];
        
        if (items.length > 0) {
          await mergeFunction(items);
          localStorage.removeItem(STORAGE_KEYS.GUEST_CART_KEY);
          useCartStore.setState({ isGuest: false });
        }
      } catch (error) {
        console.error('Failed to merge guest cart:', error);
      }
    }
  },
};
