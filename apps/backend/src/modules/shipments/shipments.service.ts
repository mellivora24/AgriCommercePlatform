import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app-prisma/prisma.service';
import { UpdateShipmentDto } from './dto';
import { console } from 'inspector';

@Injectable()
export class ShipmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getShipment(shipmentId: number) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { shipmentId },
      include: { order: true, shipper: true },
    });
    if (!shipment) throw new NotFoundException('Vận đơn không tồn tại');
    return shipment;
  }

  async getOrderShipment(orderId: number) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { orderId },
      include: { order: true, shipper: true },
    });
    if (!shipment) throw new NotFoundException('Vận đơn không tồn tại');
    return shipment;
  }

  async updateShipment(shipmentId: number, dto: UpdateShipmentDto) {
    const shipment = await this.getShipment(shipmentId);

    console.log('Current shipment:', shipment);

    return this.prisma.shipment.update({
      where: { shipmentId },
      data: {
        shipperId: dto.shipperId,
        status: dto.status as any,
        trackingCode: dto.trackingCode,
      },
      include: { order: true, shipper: true },
    });
  }

  async getShipperShipments(shipperId: number) {
    return this.prisma.shipment.findMany({
      where: { shipperId },
      include: { order: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(
    shipmentId: number,
    status:
      | 'ASSIGNED'
      | 'PICKED_UP'
      | 'DELIVERING'
      | 'DELIVERED'
      | 'RETURNING'
      | 'RETURNED',
  ) {
    return this.prisma.shipment.update({
      where: { shipmentId },
      data: { status },
      include: { order: true },
    });
  }

  async assignShipper(shipmentId: number, shipperId: number) {
    return this.prisma.shipment.update({
      where: { shipmentId },
      data: { shipperId, status: 'PICKED_UP' },
    });
  }

  async trackShipment(trackingCode: string) {
    return this.prisma.shipment.findFirst({
      where: { trackingCode },
      include: { order: true },
    });
  }
}
