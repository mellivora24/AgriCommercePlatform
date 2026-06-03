import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ShipmentStatus, OrderStatus } from '@prisma/client';
import { GetShipmentsQueryDto, ShipperAllowedStatus } from './dto';

const shipmentInclude = {
  order: {
    include: {
      orderItems: { include: { product: true } },
      buyer: true,
      seller: true,
    },
  },
};

@Injectable()
export class DeliveryService {
  constructor(private readonly prisma: PrismaService) {}

  async getShipments(shipperId: number, query: GetShipmentsQueryDto) {
    const { tab, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    let where: Record<string, unknown>;

    if (tab === 'pending') {
      where = { shipperId: null, status: ShipmentStatus.ASSIGNED };
    } else if (tab === 'active') {
      where = {
        shipperId,
        status: { in: [ShipmentStatus.PICKED_UP, ShipmentStatus.DELIVERING] },
      };
    } else {
      where = {
        shipperId,
        status: {
          in: [
            ShipmentStatus.DELIVERED,
            ShipmentStatus.RETURNING,
            ShipmentStatus.RETURNED,
          ],
        },
      };
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.shipment.findMany({
        where,
        include: shipmentInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.shipment.count({ where }),
    ]);

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getShipmentDetail(shipperId: number, shipmentId: number) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { shipmentId },
      include: shipmentInclude,
    });

    if (!shipment) throw new NotFoundException('Không tìm thấy đơn vận chuyển');

    const isPending =
      shipment.status === ShipmentStatus.ASSIGNED &&
      shipment.shipperId === null;
    const isMine = shipment.shipperId === shipperId;

    if (!isPending && !isMine) {
      throw new ForbiddenException('Bạn không có quyền xem đơn này');
    }

    return shipment;
  }

  async acceptShipment(shipperId: number, shipmentId: number) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { shipmentId },
    });

    if (!shipment) throw new NotFoundException('Không tìm thấy đơn vận chuyển');

    if (
      shipment.status !== ShipmentStatus.ASSIGNED ||
      shipment.shipperId !== null
    ) {
      throw new BadRequestException('Đơn hàng này không còn chờ nhận giao');
    }

    return this.prisma.shipment.update({
      where: { shipmentId },
      data: { shipperId, status: ShipmentStatus.PICKED_UP },
      include: shipmentInclude,
    });
  }

  async updateShipmentStatus(
    shipperId: number,
    shipmentId: number,
    status: ShipperAllowedStatus,
  ) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { shipmentId },
    });

    if (!shipment) throw new NotFoundException('Không tìm thấy đơn vận chuyển');
    if (shipment.shipperId !== shipperId)
      throw new ForbiddenException('Bạn không có quyền cập nhật đơn này');

    const orderStatusMap: Partial<Record<ShipmentStatus, OrderStatus>> = {
      [ShipmentStatus.DELIVERING]: OrderStatus.SHIPPING,
      [ShipmentStatus.DELIVERED]: OrderStatus.DELIVERED,
    };

    const orderStatus = orderStatusMap[status];

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.shipment.update({
        where: { shipmentId },
        data: { status },
        include: shipmentInclude,
      });

      if (orderStatus) {
        await tx.order.update({
          where: { orderId: shipment.orderId },
          data: { status: orderStatus },
        });
      }

      return updated;
    });
  }
}
