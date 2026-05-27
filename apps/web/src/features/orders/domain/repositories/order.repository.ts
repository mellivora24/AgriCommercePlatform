import type { CreateOrderRequest, Order, OrderListResponse, UpdateOrderStatusRequest } from '../entities/order.entity';

export interface IOrderRepository {
  listOrders(page: number, limit: number): Promise<OrderListResponse>;
  getOrder(orderId: string): Promise<Order>;
  createOrder(request: CreateOrderRequest): Promise<Order>;
  updateOrderStatus(orderId: string, request: UpdateOrderStatusRequest): Promise<Order>;
}
