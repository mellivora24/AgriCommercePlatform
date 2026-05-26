import type { CartItem } from '../../core/store';

export const calcCartTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const groupCartBySeller = (
  items: CartItem[],
): Record<string, CartItem[]> => {
  return items.reduce(
    (acc, item) => {
      if (!acc[item.sellerId]) {
        acc[item.sellerId] = [];
      }
      acc[item.sellerId].push(item);
      return acc;
    },
    {} as Record<string, CartItem[]>,
  );
};

export const mergeCartItems = (
  guestItems: CartItem[],
  serverItems: CartItem[],
): CartItem[] => {
  const merged = [...serverItems];

  guestItems.forEach((guestItem) => {
    const existingIndex = merged.findIndex(
      (item) => item.productId === guestItem.productId,
    );

    if (existingIndex >= 0) {
      merged[existingIndex] = {
        ...merged[existingIndex],
        quantity:
          merged[existingIndex].quantity + guestItem.quantity,
      };
    } else {
      merged.push(guestItem);
    }
  });

  return merged;
};

export const getCartTotalQuantity = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.quantity, 0);
};

export const validateCartItem = (item: CartItem): boolean => {
  return !!(
    item.productId &&
    item.sellerId &&
    item.name &&
    item.price > 0 &&
    item.quantity > 0
  );
};
