import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PrismaService } from '@app-prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', { infer: true })!,
    });
  }

  async validate(payload: { sub: number; email: string; role: string }) {
    const buyer = await this.prisma.buyerProfile.findUnique({
      where: { userId: payload.sub },
      select: { buyerId: true },
    });

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      buyerId: buyer?.buyerId ?? null,
      sellerId: null,
    };
  }
}
