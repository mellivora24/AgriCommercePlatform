import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@app-prisma/prisma.service';
import { CartService } from '@module/cart/cart.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
  ) {}

  async createOrder(buyerId: number, dto: CreateOrderDto) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { cart: { buyerId } },
      include: { product: true },
    });

    if (cartItems.length === 0) throw new BadRequestException('Giỏ hàng trống');

    const groupedBySeller = new Map<number, any[]>();
    for (const item of cartItems) {
      const sellerId = item.product.sellerId;
      if (!groupedBySeller.has(sellerId)) groupedBySeller.set(sellerId, []);
      groupedBySeller.get(sellerId)!.push(item);
    }

    const orders = [];

    for (const [sellerId, items] of groupedBySeller) {
      let totalAmount = 0n;
      for (const item of items) {
        totalAmount += BigInt(item.product.price) * BigInt(item.quantity);
      }

      const seller = await this.prisma.sellerProfile.findUnique({
        where: { sellerId },
      });

      if (!seller) throw new BadRequestException('Người bán không tồn tại');

      const platformFee =
        (totalAmount *
          BigInt(Math.round(Number(seller.platformFeeRate) * 100))) /
        10000n;

      const paymentStatus =
        dto.paymentMethod === 'COD' ? 'WAITING_COD_COLLECTION' : 'PENDING';

      const order = await this.prisma.order.create({
        data: {
          buyerId,
          sellerId,
          totalAmount,
          paymentMethod: dto.paymentMethod,
          platformFee,
          shippingAddress: dto.shippingAddress,
          receiverName: dto.receiverName,
          receiverPhone: dto.receiverPhone,
          status: 'PENDING_PAYMENT',
          orderItems: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.product.price,
            })),
          },
          shipment: {
            create: {
              status: 'ASSIGNED',
            },
          },
          payments: {
            create: {
              method: dto.paymentMethod,
              status: paymentStatus,
              amount: totalAmount,
            },
          },
        },
        include: {
          orderItems: { include: { product: true } },
          shipment: true,
          payments: true,
        },
      });

      orders.push(order);
    }

    await this.cartService.clearCart(buyerId);
    return orders;
  }

  async getOrder(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { orderId },
      include: {
        orderItems: { include: { product: true } },
        shipment: true,
        payments: true,
        buyer: true,
        seller: true,
      },
    });
    if (!order) throw new NotFoundException('Đơn hàng không tồn tại');
    return order;
  }

  async getOrdersByBuyer(buyerId: number) {
    return this.prisma.order.findMany({
      where: { buyerId },
      include: {
        orderItems: { include: { product: true } },
        shipment: true,
        payments: true,
        seller: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrdersBySeller(sellerId: number) {
    return this.prisma.order.findMany({
      where: { sellerId },
      include: {
        orderItems: { include: { product: true } },
        shipment: true,
        payments: true,
        buyer: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOrderStatus(
    orderId: number,
    sellerId: number,
    dto: UpdateOrderStatusDto,
  ) {
    const order = await this.getOrder(orderId);
    if (order.sellerId !== sellerId)
      throw new BadRequestException('Không có quyền');

    return this.prisma.order.update({
      where: { orderId },
      data: { status: dto.status as any },
      include: {
        orderItems: true,
        shipment: true,
        payments: true,
      },
    });
  }

  async confirmOrder(orderId: number, sellerId: number) {
    return this.updateOrderStatus(orderId, sellerId, {
      status: 'SELLER_CONFIRMED',
    });
  }

  async getOrderStats(sellerId: number) {
    const orders = await this.prisma.order.findMany({
      where: { sellerId },
    });

    return {
      total: orders.length,
      paymentMethod: orders.map((o) => o.paymentMethod),
      pending: orders.filter((o) => o.status === 'PENDING_PAYMENT').length,
      confirmed: orders.filter((o) => o.status === 'SELLER_CONFIRMED').length,
      shipped: orders.filter((o) => o.status === 'SHIPPING').length,
      delivered: orders.filter((o) => o.status === 'DELIVERED').length,
      completed: orders.filter((o) => o.status === 'COMPLETED').length,
    };
  }
}
