import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useAuthStore, useCartStore } from "@/core/store";
import { ROUTES } from "@/core/router/routes";
import type { CartItem } from "@/core/store/cart.store";
import { cartApi } from "@/features/cart/data/api/cart.api";
import { AuthRepositoryImpl } from "@/features/auth/data/repositories/auth.repository.impl";
import type {
  AuthCredentials,
  RegisterData,
} from "@/features/auth/domain/entities/auth.entity";
import {
  createLoginUseCase,
  createRegisterUseCase,
  createLogoutUseCase,
} from "@/features/auth/domain/use-cases/auth.use-case";

const authRepository = new AuthRepositoryImpl();
const loginUseCase = createLoginUseCase(authRepository);
const logoutUseCase = createLogoutUseCase(authRepository);
const registerUseCase = createRegisterUseCase(authRepository);

const syncCartToServer = async (clearCart: () => void) => {
  const cart = localStorage.getItem("cart-store");
  
  if (!cart) return;

  try {
    const cartData = JSON.parse(cart);
    const cartItems: CartItem[] = cartData?.state?.items ?? [];

    if (cartItems.length === 0) {
      localStorage.removeItem("cart-store");
      return;
    }

    let syncedCount = 0;
    for (const item of cartItems) {
      try {
        await cartApi.addToCart({
          productId: item.productId,
          quantity: item.quantity,
        });
        syncedCount++;
      } catch (error) {
        console.error(`Failed to sync item ${item.productId}:`, error);
      }
    }

    localStorage.removeItem("cart-store");
    clearCart();

    if (syncedCount > 0) {
      toast.success(`Đã đồng bộ ${syncedCount} sản phẩm từ giỏ hàng`);
    }
  } catch (error) {
    console.error("Cart sync failed:", error);
    toast.error("Không thể đồng bộ giỏ hàng. Vui lòng thử lại.");
  }
};


export const useLogin = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { clearCart } = useCartStore();

  return useMutation({
    mutationFn: async (credentials: AuthCredentials) => {
      return loginUseCase.execute(credentials);
    },
    onSuccess: async (data) => {
      setAuth(data.accessToken, data.refreshToken, data.user as any);

      await syncCartToServer(clearCart);

      navigate(ROUTES.HOME_PAGE);
    },
    onError: (error: any) => {
      console.error("Login failed:", error.message);
      toast.error(error.message || "Đăng nhập thất bại");
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { clearCart } = useCartStore();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      return registerUseCase.execute(data);
    },
    onSuccess: async (data) => {
      setAuth(data.accessToken, data.refreshToken, data.user as any);

      await syncCartToServer(clearCart);

      navigate(ROUTES.HOME_PAGE);
    },
    onError: (error: any) => {
      console.error("Register failed:", error.message);
      toast.error(error.message || "Đăng ký thất bại");
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();
  const { clearCart } = useCartStore();

  return useMutation({
    mutationFn: async () => {
      return logoutUseCase.execute();
    },
    onSuccess: () => {
      clearAuth();
      clearCart();
      navigate(ROUTES.LOGIN);
    },
    onError: (error: any) => {
      console.error("Logout failed:", error.message);
      toast.error("Đăng xuất thất bại");
    },
  });
};
