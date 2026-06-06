import type { UserRole } from '@/core/types/enum';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  name: string;
  confirmPassword: string;
  role: 'BUYER' | 'SELLER';
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
