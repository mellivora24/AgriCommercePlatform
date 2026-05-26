import React, { type PropsWithChildren, useEffect } from 'react';
import { useCartStore, useAuthStore } from '../store';

export const CartProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  useEffect(() => {
    const storedCartState = localStorage.getItem('cart-store');
    if (storedCartState) {
      try {
        const cartState = JSON.parse(storedCartState);
        const { items, isGuest } = cartState.state || cartState;

        useCartStore.setState({
          items: items || [],
          isGuest: isGuest !== false,
          totalCount: (items || []).reduce(
            (sum: number, item: any) => sum + item.quantity,
            0,
          ),
        });
      } catch (error) {
        console.error('Failed to hydrate cart store:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      useCartStore.setState({ isGuest: false });
    }
  }, [isAuthenticated]);

  return <>{children}</>;
};
