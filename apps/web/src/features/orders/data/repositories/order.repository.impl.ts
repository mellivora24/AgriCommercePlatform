import type {
  CreateOrderRequest,
  Order,
  UpdateOrderStatusRequest,
} from "@/features/orders/domain/entities/order.entity";
import type {
  IOrderRepository,
  OrderStats,
} from "@/features/orders/domain/repositories/order.repository";
import { OrderMapper } from "@/features/orders/data/mappers/order.mapper";
import type { OrdersApi, SellerOrderStatsDTO } from "@/features/orders/data/api/orders.api";

export const createOrderRepository = (
  ordersApi: OrdersApi,
): IOrderRepository => ({
  listBuyerOrders: async (): Promise<Order[]> => {
    const dtos = await ordersApi.listOrders();
    return OrderMapper.toOrderListEntity(dtos);
  },

  getOrder: async (orderId: number): Promise<Order> => {
    const dto = await ordersApi.getOrder(orderId);
    return OrderMapper.toEntity(dto);
  },

  createOrder: async (request: CreateOrderRequest): Promise<Order[]> => {
    const dtos = await ordersApi.createOrder({
      shippingAddress: request.shippingAddress,
      receiverName: request.receiverName,
      receiverPhone: request.receiverPhone,
    });
    return OrderMapper.toCreateOrderEntity(dtos);
  },

  updateOrderStatus: async (
    orderId: number,
    request: UpdateOrderStatusRequest,
  ): Promise<Order> => {
    const dto = await ordersApi.updateOrderStatus(orderId, {
      status: request.status,
    });
    return OrderMapper.toEntity(dto);
  },

  confirmOrder: async (orderId: number): Promise<Order> => {
    const dto = await ordersApi.confirmOrder(orderId);
    return OrderMapper.toEntity(dto);
  },

  listSellerOrders: async (): Promise<Order[]> => {
    const dtos = await ordersApi.listSellerOrders();
    return OrderMapper.toOrderListEntity(dtos);
  },

  getSellerOrderStats: async (): Promise<OrderStats> => {
    const dto: SellerOrderStatsDTO = await ordersApi.getSellerOrderStats();
    return dto;
  },
});
