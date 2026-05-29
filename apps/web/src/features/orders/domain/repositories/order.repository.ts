import type {
  CreateOrderRequest,
  Order,
  UpdateOrderStatusRequest,
} from "@/features/orders/domain/entities/order.entity";

export interface IOrderRepository {
  listBuyerOrders(): Promise<Order[]>;
  getOrder(orderId: number): Promise<Order>;
  createOrder(request: CreateOrderRequest): Promise<Order[]>;
  updateOrderStatus(
    orderId: number,
    request: UpdateOrderStatusRequest,
  ): Promise<Order>;
  confirmOrder(orderId: number): Promise<Order>;
  listSellerOrders(): Promise<Order[]>;
  getSellerOrderStats(): Promise<OrderStats>;
}

export interface OrderStats {
  total: number;
  pending: number; // PENDING_PAYMENT
  confirmed: number; // SELLER_CONFIRMED
  shipped: number; // SHIPPING
  delivered: number; // DELIVERED
  completed: number; // COMPLETED
}
