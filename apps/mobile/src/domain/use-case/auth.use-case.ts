import type { IAuthRepository } from '../repositories/auth.repository';
import type { AuthCredentials, RegisterData } from '../entities/auth.entity';

export const createLoginUseCase = (repository: IAuthRepository) => ({
  execute: async (credentials: AuthCredentials) => repository.login(credentials),
});

export const createRegisterUseCase = (repository: IAuthRepository) => ({
  execute: async (data: RegisterData) => repository.register(data),
});

export const createLogoutUseCase = (repository: IAuthRepository) => ({
  execute: async () => repository.logout(),
});
