import type { Order, OrderListResponse } from '../entities/order.entity';

export interface IOrderRepository {
  listOrders(): Promise<OrderListResponse>;
  getOrder(orderId: number): Promise<Order>;
}
