import type {
  OrderDto,
  OrderListResponseDto,
  OrderStatsDto,
} from '../dtos/order.dto';
import type {
  Order,
  OrderListResponse,
  OrderStats,
} from '@/domain/entities/order.entity';

const toNumber = (val: number | string): number => Number(val);

export const OrderMapper = {
  toEntity: (dto: OrderDto): Order => ({
    orderId: dto.orderId,
    buyerId: dto.buyerId,
    sellerId: dto.sellerId,
    status: dto.status,
    paymentMethod: dto.paymentMethod,
    totalAmount: toNumber(dto.totalAmount),
    platformFee: toNumber(dto.platformFee),
    shippingAddress: dto.shippingAddress,
    receiverName: dto.receiverName,
    receiverPhone: dto.receiverPhone,
    createdAt: dto.createdAt,
    orderItems: dto.orderItems.map((item) => ({
      orderItemId: item.orderItemId,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: toNumber(item.unitPrice),
      product: item.product,
    })),
    shipment: dto.shipment,
    payments: dto.payments.map((p) => ({
      ...p,
      amount: toNumber(p.amount),
    })),
    buyer: dto.buyer,
    seller: dto.seller,
  }),

  toListEntity: (dto: OrderListResponseDto): OrderListResponse => ({
    items: dto.items.map(OrderMapper.toEntity),
    pagination: dto.pagination,
  }),

  toStats: (dto: OrderStatsDto): OrderStats => ({
    total: dto.total,
    statistics: dto.statistics,
  }),
};
