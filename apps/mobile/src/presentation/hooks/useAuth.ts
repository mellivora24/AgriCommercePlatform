import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useAuthStore, useCartStore } from '@/core/store';
import { ROUTES } from '@/core/router';
import type { AuthCredentials, RegisterData } from '@/domain/entities/auth.entity';
import { AuthRepositoryImpl } from '@/data/repositories/auth.repository.impl';
import { cartApi } from '@/data/apis/cart.api';
import { createLoginUseCase, createLogoutUseCase, createRegisterUseCase } from '@/domain/use-case/auth.use-case';

const authRepository = new AuthRepositoryImpl();
const loginUseCase = createLoginUseCase(authRepository);
const registerUseCase = createRegisterUseCase(authRepository);
const logoutUseCase = createLogoutUseCase(authRepository);

const syncCartToServer = async (clearCart: () => void) => {
  const items = useCartStore.getState().items;

  if (items.length === 0) {
    clearCart();
    return;
  }

  for (const item of items) {
    await cartApi.addToCart({
      productId: item.productId,
      quantity: item.quantity,
    });
  }

  clearCart();
};

export const useLogin = () => {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { clearCart } = useCartStore();

  return useMutation({
    mutationFn: (credentials: AuthCredentials) => loginUseCase.execute(credentials),
    onSuccess: async (data) => {
      await setAuth(data.accessToken, data.refreshToken, data.user);
      await syncCartToServer(clearCart);
      router.replace(ROUTES.HOME_PAGE);
    },
  });
};

export const useRegister = () => {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { clearCart } = useCartStore();

  return useMutation({
    mutationFn: (data: RegisterData) => registerUseCase.execute(data),
    onSuccess: async (data) => {
      if (data.user.role === 'SELLER') {
        router.replace(ROUTES.SELLER_PENDING);
        return;
      }

      await setAuth(data.accessToken, data.refreshToken, data.user);
      await syncCartToServer(clearCart);
      router.replace(ROUTES.HOME_PAGE);
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const { clearAuth } = useAuthStore();
  const { clearCart } = useCartStore();

  return useMutation({
    mutationFn: () => logoutUseCase.execute(),
    onSuccess: () => {
      clearAuth();
      clearCart();
      router.replace(ROUTES.LOGIN);
    },
  });
};
