import { User } from '@prisma/client';

export class UsersMapper {
  static toResponse(user: User, nameOverride?: string) {
    return {
      id: user.userId,
      email: user.email,
      name: nameOverride || user.email.split('@')[0], // Use name param or extract from email
      phone: user.phone,
      role: user.role,
      account_status: user.status,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }
}
