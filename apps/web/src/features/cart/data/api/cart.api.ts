import type {
  CartDto,
  DeleteCartItemDto,
} from "@/features/cart/data/dtos/cart.dto";
import type { CartResponse } from "@/core/store/cart.store";

export const cartApi = {
  getCartItems: async (): Promise<CartResponse> => {
    const { axiosInstance } = await import("@/core/network");
    const response = await axiosInstance.get("/cart");
    return response.data;
  },

  addToCart: async (data: CartDto): Promise<CartResponse> => {
    const { axiosInstance } = await import("@/core/network");
    const response = await axiosInstance.post("/cart", data);
    return response.data;
  },

  updateCartItem: async (data: CartDto): Promise<CartResponse> => {
    const { axiosInstance } = await import("@/core/network");
    const response = await axiosInstance.put("/cart", data);
    return response.data;
  },

  removeFromCart: async (data: DeleteCartItemDto): Promise<CartResponse> => {
    const { axiosInstance } = await import("@/core/network");
    const response = await axiosInstance.delete("/cart/items", { data });
    return response.data;
  },
};
