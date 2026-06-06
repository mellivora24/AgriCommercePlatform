import type { AuthResponseDTO, AuthUserDTO } from '../dtos/auth.dto';
import type { AuthResponse, AuthUser } from '@/domain/entities/auth.entity';

export const AuthMapper = {
  toEntity: (dto: AuthResponseDTO): AuthResponse => ({
    accessToken: dto.accessToken,
    refreshToken: dto.refreshToken,
    user: AuthMapper.toUserEntity(dto.user),
  }),
  toUserEntity: (dto: AuthUserDTO): AuthUser => ({
    id: dto.id,
    email: dto.email,
    name: dto.name,
    avatar: dto.avatar,
    role: dto.role,
    createdAt: dto.createdAt,
  }),
};
