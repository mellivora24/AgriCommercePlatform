import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@app-prisma/prisma.service';
import { CreateBuyerProfileDto, UpdateBuyerProfileDto } from './dto';

@Injectable()
export class BuyerProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async createBuyerProfile(userId: number, dto: CreateBuyerProfileDto) {
    const existingProfile = await this.prisma.buyerProfile.findUnique({
      where: { userId },
    });
    if (existingProfile) throw new BadRequestException('Hồ sơ đã tồn tại');

    return this.prisma.buyerProfile.create({
      data: {
        userId,
        fullName: dto.fullName,
        avatarUrl: dto.avatarUrl,
        address: dto.address,
      },
    });
  }

  async getBuyerProfile(buyerId: number) {
    const profile = await this.prisma.buyerProfile.findUnique({
      where: { buyerId },
      include: { cart: true, orders: true },
    });
    if (!profile) throw new NotFoundException('Hồ sơ không tồn tại');
    return profile;
  }

  async getBuyerProfileByUserId(userId: number) {
    const profile = await this.prisma.buyerProfile.findUnique({
      where: { userId },
      include: { cart: true },
    });
    if (!profile) throw new NotFoundException('Hồ sơ không tồn tại');
    return profile;
  }

  async updateBuyerProfile(buyerId: number, dto: UpdateBuyerProfileDto) {
    return this.prisma.buyerProfile.update({
      where: { buyerId },
      data: dto,
    });
  }

  async getOrderHistory(buyerId: number) {
    return this.prisma.order.findMany({
      where: { buyerId },
      include: {
        seller: { select: { storeName: true } },
        orderItems: { include: { product: true } },
        payments: true,
        shipment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
