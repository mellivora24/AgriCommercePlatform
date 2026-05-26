import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../../core/store';
import { ROUTES } from '../../../../core/router/routes';
import { AuthRepositoryImpl } from '../../data/repositories/auth.repository.impl';
import { createLoginUseCase, createRegisterUseCase, createLogoutUseCase } from '../../domain/use-cases/auth.use-case';
import type { AuthCredentials, RegisterData } from '../../domain/entities/auth.entity';

const authRepository = new AuthRepositoryImpl();
const loginUseCase = createLoginUseCase(authRepository);
const registerUseCase = createRegisterUseCase(authRepository);
const logoutUseCase = createLogoutUseCase(authRepository);

export const useLogin = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: AuthCredentials) => {
      return loginUseCase.execute(credentials);
    },
    onSuccess: (data) => {
      setAuth(data.accessToken, data.refreshToken, data.user as any);
      navigate(ROUTES.HOME);
    },
    onError: (error: any) => {
      console.error('Login failed:', error.message);
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      return registerUseCase.execute(data);
    },
    onSuccess: (data) => {
      setAuth(data.accessToken, data.refreshToken, data.user as any);
      navigate(ROUTES.HOME);
    },
    onError: (error: any) => {
      console.error('Register failed:', error.message);
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      return logoutUseCase.execute();
    },
    onSuccess: () => {
      clearAuth();
      navigate(ROUTES.LOGIN);
    },
  });
};
