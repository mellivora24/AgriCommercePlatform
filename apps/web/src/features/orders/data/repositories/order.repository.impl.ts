import type { CreateOrderRequest, Order, OrderListResponse, UpdateOrderStatusRequest } from '../../domain/entities/order.entity';
import type { IOrderRepository } from '../../domain/repositories/order.repository';
import { OrderMapper } from '../mappers/order.mapper';
import type { OrdersApi } from '../api/orders.api';

export const createOrderRepository = (ordersApi: OrdersApi): IOrderRepository => ({
  listOrders: async (page: number, limit: number): Promise<OrderListResponse> => {
    const dto = await ordersApi.listOrders(page, limit);
    return OrderMapper.toOrderListEntity(dto);
  },

  getOrder: async (orderId: string): Promise<Order> => {
    const dto = await ordersApi.getOrder(orderId);
    return OrderMapper.toEntity(dto);
  },

  createOrder: async (request: CreateOrderRequest): Promise<Order> => {
    const dto = await ordersApi.createOrder(request);
    return OrderMapper.toEntity(dto);
  },

  updateOrderStatus: async (orderId: string, request: UpdateOrderStatusRequest): Promise<Order> => {
    const dto = await ordersApi.updateOrderStatus(orderId, request);
    return OrderMapper.toEntity(dto);
  },
});
