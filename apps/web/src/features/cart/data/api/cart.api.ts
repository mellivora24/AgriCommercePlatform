import { axiosInstance } from "@/core/network";
import type { CartDto, DeleteCartItemDto } from "@/features/cart/data/dtos/cart.dto";

export const cartApi = {
    addToCart: async (data: CartDto) => {
        const response = await axiosInstance.post('/cart', data);
        return response.data;
    },

    updateCartItem: async (data: CartDto) => {
        const response = await axiosInstance.put(`/cart`, data);
        return response.data;
    },

    removeFromCart: async (data: DeleteCartItemDto) => {
        await axiosInstance.delete(`/cart/items`, { data });
    },

    getCartItems: async () => {
        const response = await axiosInstance.get('/cart');
        return response.data;
    },
};
