import type {
  CreateOrderRequest,
  GetSellerOrdersParams,
  Order,
  PaginatedOrderList,
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
  completeOrder(orderId: number): Promise<Order>;
  cancelOrder(orderId: number): Promise<Order>;
  listSellerOrders(params?: GetSellerOrdersParams): Promise<PaginatedOrderList>;
  getSellerOrderStats(): Promise<OrderStats>;
}

export interface OrderStatItem {
  status: string;
  count: number;
}

export interface OrderStats {
  total: number;
  statistics: OrderStatItem[];
}
