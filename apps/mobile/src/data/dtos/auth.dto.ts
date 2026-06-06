import type { UserRole } from '@/core/types/enum';

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface RegisterRequestDTO extends LoginRequestDTO {
  name: string;
  role: 'BUYER' | 'SELLER';
}

export interface AuthUserDTO {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt?: string;
}

export interface AuthResponseDTO {
  accessToken: string;
  refreshToken: string;
  user: AuthUserDTO;
}
