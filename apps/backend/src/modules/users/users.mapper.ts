import { User } from '@prisma/client';

export class UsersMapper {
  static toResponse(user: User) {
    return {
      id: user.userId,
      email: user.email,
      phone: user.phone,
      role: user.role,
      account_status: user.status,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }
}
