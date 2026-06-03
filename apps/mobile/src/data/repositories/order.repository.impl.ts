import type { IOrderRepository } from '@/domain/repositories/order.repository';
import type { Order, OrderListResponse } from '@/domain/entities/order.entity';
import { ordersApi } from '../apis/orders.api';
import { OrderMapper } from '../mappers/order.mapper';

export class OrderRepositoryImpl implements IOrderRepository {
  async listOrders(): Promise<OrderListResponse> {
    const dto = await ordersApi.listOrders();
    return OrderMapper.toListEntity(dto);
  }

  async getOrder(orderId: number): Promise<Order> {
    const dto = await ordersApi.getOrder(orderId);
    return OrderMapper.toEntity(dto);
  }
}
