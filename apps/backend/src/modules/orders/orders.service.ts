import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@app-prisma/prisma.service';
import { CartService } from '@module/cart/cart.service';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
  GetSellerOrdersDto,
} from './dto';
import { OrderStatus, Prisma } from '@prisma/client';

const SELLER_CONFIRMABLE_STATUSES: OrderStatus[] = [
  'WAITING_SELLER_CONFIRMATION',
];

const SELLER_CANCELLABLE_STATUSES: OrderStatus[] = [
  'WAITING_SELLER_CONFIRMATION',
  'PAID',
];

const STATISTIC_STATUSES: OrderStatus[] = [
  'WAITING_SELLER_CONFIRMATION',
  'SELLER_CONFIRMED',
  'SHIPPING',
  'DELIVERED',
  'COMPLETED',
  'CANCELLED',
  'RETURN_REQUESTED',
  'REFUNDED',
];

const ORDER_INCLUDE = {
  orderItems: {
    include: {
      product: {
        include: {
          images: { take: 1 },
        },
      },
    },
  },
  shipment: true,
  payments: true,
  buyer: {
    include: { user: true },
  },
} satisfies Prisma.OrderInclude;

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
        dto.paymentMethod === 'COD' ? 'WAITING_COD_COLLECTION' : 'PAID';

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
          status: 'WAITING_SELLER_CONFIRMATION',
          orderItems: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.product.price,
            })),
          },
          shipment: {
            create: { status: 'ASSIGNED' },
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
        ...ORDER_INCLUDE,
        seller: true,
      },
    });
    if (!order) throw new NotFoundException('Đơn hàng không tồn tại');
    return order;
  }

  async getOrdersByBuyer(buyerId: number) {
    return this.prisma.order.findMany({
      where: { buyerId },
      include: ORDER_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrdersBySeller(sellerId: number, dto: GetSellerOrdersDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {
      sellerId,
      ...(dto.status && { status: dto.status as OrderStatus }),
      ...(dto.keyword && {
        OR: [
          {
            buyer: {
              fullName: { contains: dto.keyword, mode: 'insensitive' },
            },
          },
          {
            buyer: {
              user: {
                email: { contains: dto.keyword, mode: 'insensitive' },
              },
            },
          },
          // Tìm theo mã đơn nếu keyword là số
          ...(isNaN(Number(dto.keyword))
            ? []
            : [{ orderId: { equals: Number(dto.keyword) } }]),
        ],
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: ORDER_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
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
      data: { status: dto.status as OrderStatus },
      include: ORDER_INCLUDE,
    });
  }

  async confirmOrder(orderId: number, sellerId: number) {
    const order = await this.getOrder(orderId);

    if (order.sellerId !== sellerId)
      throw new BadRequestException('Không có quyền');

    if (!SELLER_CONFIRMABLE_STATUSES.includes(order.status)) {
      throw new BadRequestException(
        `Không thể xác nhận đơn ở trạng thái "${order.status}"`,
      );
    }

    return this.prisma.order.update({
      where: { orderId },
      data: { status: 'SELLER_CONFIRMED' },
      include: ORDER_INCLUDE,
    });
  }

  async cancelOrder(orderId: number, sellerId: number) {
    const order = await this.getOrder(orderId);

    if (order.sellerId !== sellerId)
      throw new BadRequestException('Không có quyền');

    if (!SELLER_CANCELLABLE_STATUSES.includes(order.status)) {
      throw new BadRequestException(
        `Không thể từ chối đơn ở trạng thái "${order.status}"`,
      );
    }

    return this.prisma.order.update({
      where: { orderId },
      data: { status: 'CANCELLED' },
      include: ORDER_INCLUDE,
    });
  }

  async completeOrder(orderId: number, buyerId: number) {
    const order = await this.getOrder(orderId);

    if (order.buyerId !== buyerId) throw new BadRequestException('Không có quyền');

    if (order.status !== 'DELIVERED') {
      throw new BadRequestException(
        `Không thể hoàn thành đơn ở trạng thái "${order.status}"`,
      );
    }

    return this.prisma.order.update({
      where: { orderId },
      data: { status: 'COMPLETED' },
      include: ORDER_INCLUDE,
    });
  }

  async getOrderStats(sellerId: number) {
    // Dùng groupBy thay vì load toàn bộ records vào memory
    const grouped = await this.prisma.order.groupBy({
      by: ['status'],
      where: { sellerId },
      _count: { status: true },
    });

    // Đảm bảo tất cả status trong STATISTIC_STATUSES đều có mặt (kể cả count = 0)
    const statistics = STATISTIC_STATUSES.map((status) => ({
      status,
      count: grouped.find((g) => g.status === status)?._count.status ?? 0,
    }));

    const total = grouped.reduce((sum, g) => sum + g._count.status, 0);

    return { total, statistics };
  }
}
