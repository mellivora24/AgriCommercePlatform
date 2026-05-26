import type { AuthCredentials, RegisterData, AuthResponse, AuthUser } from '../entities/auth.entity';

export interface IAuthRepository {
  login(credentials: AuthCredentials): Promise<AuthResponse>;
  register(data: RegisterData): Promise<AuthResponse>;
  refreshToken(refreshToken: string): Promise<AuthResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser>;
}
