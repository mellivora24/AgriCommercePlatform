import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@app-prisma/prisma.service';
import { UpdateShipperStatusDto } from './dto';

@Injectable()
export class ShipperProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async createShipperProfile(userId: number) {
    const existingProfile = await this.prisma.shipperProfile.findUnique({
      where: { userId },
    });
    if (existingProfile) throw new BadRequestException('Hồ sơ đã tồn tại');

    return this.prisma.shipperProfile.create({
      data: {
        userId,
        status: 'WORKING',
      },
    });
  }

  async getShipperProfile(shipperId: number) {
    const profile = await this.prisma.shipperProfile.findUnique({
      where: { shipperId },
      include: { user: true, shipments: true },
    });
    if (!profile) throw new NotFoundException('Hồ sơ không tồn tại');
    return profile;
  }

  async getShipperProfileByUserId(userId: number) {
    const profile = await this.prisma.shipperProfile.findUnique({
      where: { userId },
      include: { shipments: true },
    });
    if (!profile) throw new NotFoundException('Hồ sơ không tồn tại');
    return profile;
  }

  async updateShipperStatus(shipperId: number, dto: UpdateShipperStatusDto) {
    return this.prisma.shipperProfile.update({
      where: { shipperId },
      data: { status: dto.status },
    });
  }

  async getShipperShipments(shipperId: number) {
    return this.prisma.shipment.findMany({
      where: { shipperId },
      include: {
        order: {
          select: {
            orderId: true,
            receiverName: true,
            shippingAddress: true,
            totalAmount: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAvailableShippers() {
    return this.prisma.shipperProfile.findMany({
      where: { status: 'WORKING' },
      include: {
        _count: { select: { shipments: true } },
      },
    });
  }
}
