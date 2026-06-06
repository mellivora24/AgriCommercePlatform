import type { OrderDto, OrderListResponseDto } from '../dtos/order.dto';
import type { Order, OrderListResponse } from '@/domain/entities/order.entity';

export const OrderMapper = {
  toEntity: (dto: OrderDto): Order => ({
    orderId: dto.orderId,
    status: dto.status,
    paymentStatus: dto.paymentStatus,
    totalAmount: dto.totalAmount,
    createdAt: dto.createdAt,
    items: dto.items,
  }),
  toListEntity: (dto: OrderListResponseDto): OrderListResponse => ({
    items: dto.items.map((item) => OrderMapper.toEntity(item)),
    total: dto.total,
  }),
};
