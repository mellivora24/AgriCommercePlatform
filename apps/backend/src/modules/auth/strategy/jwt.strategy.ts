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
    let buyerId: number | undefined;
    let sellerId: number | undefined;
    let shipperId: number | undefined;
    let adminId: number | undefined;

    switch (payload.role) {
      case 'BUYER': {
        const buyer = await this.prisma.buyerProfile.findUnique({
          where: { userId: payload.sub },
          select: { buyerId: true },
        });

        buyerId = buyer?.buyerId;
        break;
      }

      case 'SELLER': {
        const seller = await this.prisma.sellerProfile.findUnique({
          where: { userId: payload.sub },
          select: { sellerId: true },
        });

        sellerId = seller?.sellerId;
        break;
      }

      case 'SHIPPER': {
        const shipper = await this.prisma.shipperProfile.findUnique({
          where: { userId: payload.sub },
          select: { shipperId: true },
        });

        shipperId = shipper?.shipperId;
        break;
      }

      case 'ADMIN': {
        const admin = await this.prisma.adminProfile.findUnique({
          where: { userId: payload.sub },
          select: { adminId: true },
        });

        adminId = admin?.adminId;
        break;
      }
    }

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,

      buyerId,
      sellerId,
      shipperId,
      adminId,
    };
  }
}
