import type { AuthCredentials, AuthResponse, AuthUser, RegisterData } from '../entities/auth.entity';

export interface IAuthRepository {
  login(credentials: AuthCredentials): Promise<AuthResponse>;
  register(data: RegisterData): Promise<AuthResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser>;
  refreshToken(refreshToken: string): Promise<AuthResponse>;
}
