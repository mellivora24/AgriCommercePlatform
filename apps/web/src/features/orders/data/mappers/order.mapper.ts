import type { Order, OrderListResponse } from '../../domain/entities/order.entity';
import type { OrderDTO, OrderListResponseDTO } from '../dtos/order.dto';

export const OrderMapper = {
  toEntity: (dto: OrderDTO): Order => dto,

  toOrderListEntity: (dto: OrderListResponseDTO): OrderListResponse => ({
    items: dto.items.map(item => OrderMapper.toEntity(item)),
    total: dto.total,
    page: dto.page,
    limit: dto.limit,
  }),
};
