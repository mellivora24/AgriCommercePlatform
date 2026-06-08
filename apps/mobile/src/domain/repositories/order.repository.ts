import type { Order, OrderListResponse, OrderStats } from '../entities/order.entity';

export interface CreateOrderPayload {
  paymentMethod: 'ONLINE' | 'COD';
  shippingAddress: string;
  receiverName: string;
  receiverPhone: string;
}

export interface GetSellerOrdersParams {
  status?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}

export interface IOrderRepository {
  createOrder(payload: CreateOrderPayload): Promise<Order[]>;
  getOrder(orderId: number): Promise<Order>;
  listBuyerOrders(): Promise<Order[]>;
  listSellerOrders(params: GetSellerOrdersParams): Promise<OrderListResponse>;
  getSellerOrderStats(): Promise<OrderStats>;
  updateOrderStatus(orderId: number, status: string): Promise<Order>;
  confirmOrder(orderId: number): Promise<Order>;
  cancelOrder(orderId: number): Promise<Order>;
}
