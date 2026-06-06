import { authApi } from '../apis/auth.api';
import { AuthMapper } from '../mappers/auth.mapper';
import type { IAuthRepository } from '@/domain/repositories/auth.repository';
import type { AuthCredentials, AuthResponse, AuthUser, RegisterData } from '@/domain/entities/auth.entity';

export class AuthRepositoryImpl implements IAuthRepository {
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const dto = await authApi.login(credentials);
    return AuthMapper.toEntity(dto);
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const dto = await authApi.register({
      email: data.email,
      name: data.name,
      password: data.password,
      role: data.role,
    });

    return AuthMapper.toEntity(dto);
  }

  async logout(): Promise<void> {
    await authApi.logout();
  }

  async getCurrentUser(): Promise<AuthUser> {
    const dto = await authApi.getCurrentUser();
    return AuthMapper.toUserEntity(dto);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const dto = await authApi.refreshToken(refreshToken);
    return AuthMapper.toEntity(dto);
  }
}
