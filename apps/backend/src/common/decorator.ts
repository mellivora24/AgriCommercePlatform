import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { AuthRequest, AuthUser } from '@module/auth/types/auth.type';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthUser => {
    const req = ctx.switchToHttp().getRequest<AuthRequest>();
    if (!req.user) {
      throw new UnauthorizedException('Không tìm thấy thông tin user từ req');
    }
    return req.user;
  },
);
