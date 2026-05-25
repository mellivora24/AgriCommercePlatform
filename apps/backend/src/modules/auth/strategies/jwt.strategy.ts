import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload, AuthUser } from '@module/auth/types/auth.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'access-token') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
    });
  }

  validate(payload: JwtPayload): AuthUser {
    return {
      userId: Number(payload.sub),
      email: payload.email,
      role: payload.role,
    };
  }

  // Note:
  // req.user = { userId: payload.sub, email: payload.email, role: payload.role }; => passport gắn user vào req sau khi xác thực thành công
  // req.body = { ...req.body, userId: payload.sub }; => Đây là dữ liệu mà client gửi lên
}
