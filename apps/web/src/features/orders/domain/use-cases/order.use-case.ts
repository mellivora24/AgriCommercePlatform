import type { CreateOrderRequest, Order, OrderListResponse, UpdateOrderStatusRequest } from '../entities/order.entity';
import type { IOrderRepository } from '../repositories/order.repository';

export interface ListOrdersUseCase {
  execute(page: number, limit: number): Promise<OrderListResponse>;
}

export interface GetOrderUseCase {
  execute(orderId: string): Promise<Order>;
}

export interface CreateOrderUseCase {
  execute(request: CreateOrderRequest): Promise<Order>;
}

export interface UpdateOrderStatusUseCase {
  execute(orderId: string, request: UpdateOrderStatusRequest): Promise<Order>;
}

export const createListOrdersUseCase = (repository: IOrderRepository): ListOrdersUseCase => ({
  execute: (page: number, limit: number) => repository.listOrders(page, limit),
});

export const createGetOrderUseCase = (repository: IOrderRepository): GetOrderUseCase => ({
  execute: (orderId: string) => repository.getOrder(orderId),
});

export const createCreateOrderUseCase = (repository: IOrderRepository): CreateOrderUseCase => ({
  execute: (request: CreateOrderRequest) => repository.createOrder(request),
});

export const createUpdateOrderStatusUseCase = (repository: IOrderRepository): UpdateOrderStatusUseCase => ({
  execute: (orderId: string, request: UpdateOrderStatusRequest) => repository.updateOrderStatus(orderId, request),
});
