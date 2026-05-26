import type { IAuthRepository } from '../repositories/auth.repository';
import type { AuthCredentials, RegisterData, AuthResponse } from '../entities/auth.entity';

export type LoginUseCase = {
  execute: (credentials: AuthCredentials) => Promise<AuthResponse>;
};

export const createLoginUseCase = (authRepository: IAuthRepository): LoginUseCase => ({
  execute: (credentials) => authRepository.login(credentials),
});

export type RegisterUseCase = {
  execute: (data: RegisterData) => Promise<AuthResponse>;
};

export const createRegisterUseCase = (authRepository: IAuthRepository): RegisterUseCase => ({
  execute: (data) => authRepository.register(data),
});

export type LogoutUseCase = {
  execute: () => Promise<void>;
};

export const createLogoutUseCase = (authRepository: IAuthRepository): LogoutUseCase => ({
  execute: () => authRepository.logout(),
});

export type GetCurrentUserUseCase = {
  execute: () => Promise<any>;
};

export const createGetCurrentUserUseCase = (authRepository: IAuthRepository): GetCurrentUserUseCase => ({
  execute: () => authRepository.getCurrentUser(),
});

export type RefreshTokenUseCase = {
  execute: (refreshToken: string) => Promise<AuthResponse>;
};

export const createRefreshTokenUseCase = (authRepository: IAuthRepository): RefreshTokenUseCase => ({
  execute: (refreshToken) => authRepository.refreshToken(refreshToken),
});
