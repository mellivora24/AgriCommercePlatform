import type {
  CreateOrderRequest,
  Order,
  UpdateOrderStatusRequest,
  GetSellerOrdersParams,
  PaginatedOrderList,
} from "@/features/orders/domain/entities/order.entity";
import type {
  IOrderRepository,
  OrderStats,
} from "@/features/orders/domain/repositories/order.repository";
import { OrderMapper } from "@/features/orders/data/mappers/order.mapper";
import type { OrdersApi } from "@/features/orders/data/api/orders.api";

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
    const dtos = await ordersApi.createOrder(request);
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

  completeOrder: async (orderId: number): Promise<Order> => {
    const dto = await ordersApi.completeOrder(orderId);
    return OrderMapper.toEntity(dto);
  },

  cancelOrder: async (orderId: number): Promise<Order> => {
    const dto = await ordersApi.cancelOrder(orderId);
    return OrderMapper.toEntity(dto);
  },

  listSellerOrders: (async (
    params?: GetSellerOrdersParams,
  ): Promise<PaginatedOrderList> => {
    const dto = await ordersApi.listSellerOrders(params);
    return OrderMapper.toPaginatedOrderList(dto);
  }) as IOrderRepository["listSellerOrders"],

  getSellerOrderStats: async (): Promise<OrderStats> => {
    const dto = await ordersApi.getSellerOrderStats();
    return {
      total: dto.total,
      statistics: dto.statistics,
    };
  },
});
