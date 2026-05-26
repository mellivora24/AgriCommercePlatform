import type { IAuthRepository } from '../../domain/repositories/auth.repository';
import type { AuthCredentials, RegisterData, AuthResponse } from '../../domain/entities/auth.entity';
import { authApi } from '../api/auth.api';
import { AuthMapper } from '../mappers/auth.mapper';

export class AuthRepositoryImpl implements IAuthRepository {
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const dto = await authApi.login(credentials);
    // console.log('Login response DTO:', dto);
    return AuthMapper.toEntity(dto);
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const dto = await authApi.register({
      email: data.email,
      name: data.name,
      password: data.password,
    });
    console.log('Register response DTO:', dto);
    return AuthMapper.toEntity(dto);
  }

  async logout(): Promise<void> {
    await authApi.logout();
  }

  async getCurrentUser() {
    const dto = await authApi.getCurrentUser();
    return AuthMapper.toUserEntity(dto);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const dto = await authApi.refreshToken(refreshToken);
    return AuthMapper.toEntity(dto);
  }
}
