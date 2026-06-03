import type { AuthResponseDTO } from '../dtos/auth.dto';
import type { AuthResponse, AuthUser } from '../../domain/entities/auth.entity';

export class AuthMapper {
  static toEntity(dto: AuthResponseDTO): AuthResponse {
    // if (dto.user.userId === undefined) {
    //   throw new Error('Invalid user data: userId is missing');
    // }
    return {
      accessToken: dto.accessToken,
      refreshToken: dto.refreshToken,
      user: {
        id: dto.user.userId,
        email: dto.user.email,
        name: dto.user.name,
        avatar: dto.user.avatar,
        role: dto.user.role as 'BUYER' | 'SELLER' | 'ADMIN' | 'SHIPPER',
        createdAt: dto.user.createdAt,
      },
    };
  }

  static toUserEntity(dto: AuthResponseDTO['user']): AuthUser {
    return {
      id: dto.userId,
      email: dto.email,
      name: dto.name,
      avatar: dto.avatar,
      role: dto.role as 'BUYER' | 'SELLER' | 'ADMIN' | 'SHIPPER',
      createdAt: dto.createdAt,
    };
  }
}
