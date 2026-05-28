import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/features/cart/data/api/cart.api';
import type { CartDto, DeleteCartItemDto } from '@/features/cart/data/dtos/cart.dto';
import { useAuthStore } from '@/core/store';

const CART_KEY = ['cart'];

export const useGetCart = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  return useQuery({
    queryKey: CART_KEY,
    queryFn: cartApi.getCartItems,
    enabled: isHydrated && isAuthenticated,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CartDto) => cartApi.addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CartDto) => cartApi.updateCartItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DeleteCartItemDto) => cartApi.removeFromCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
  });
};
