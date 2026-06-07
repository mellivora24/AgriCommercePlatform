import { axiosInstance } from '@/core/axios/axiosInstance';
import type { CartDto, DeleteCartItemDto, CartResponseDto } from '../dtos/cart.dto';

export const cartApi = {
  getCartItems: async (): Promise<CartResponseDto> => {
    const response = await axiosInstance.get<CartResponseDto>('/cart');
    return response.data;
  },

  addToCart: async (data: CartDto): Promise<CartResponseDto> => {
    const response = await axiosInstance.post<CartResponseDto>('/cart', data);
    return response.data;
  },

  updateCartItem: async (data: CartDto): Promise<CartResponseDto> => {
    const response = await axiosInstance.put<CartResponseDto>('/cart', data);
    return response.data;
  },

  removeFromCart: async (data: DeleteCartItemDto): Promise<CartResponseDto> => {
    const response = await axiosInstance.delete<CartResponseDto>('/cart/items', { data });
    return response.data;
  },
};
