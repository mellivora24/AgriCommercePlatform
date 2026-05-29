import type {
  CreateOrderRequest,
  Order,
  UpdateOrderStatusRequest,
} from "@/features/orders/domain/entities/order.entity";
import type {
  IOrderRepository,
  OrderStats,
} from "@/features/orders/domain/repositories/order.repository";

export interface ListBuyerOrdersUseCase {
  execute(): Promise<Order[]>;
}

export interface GetOrderUseCase {
  execute(orderId: number): Promise<Order>;
}

export interface CreateOrderUseCase {
  execute(request: CreateOrderRequest): Promise<Order[]>;
}

export interface UpdateOrderStatusUseCase {
  execute(orderId: number, request: UpdateOrderStatusRequest): Promise<Order>;
}

export interface ConfirmOrderUseCase {
  execute(orderId: number): Promise<Order>;
}

export interface ListSellerOrdersUseCase {
  execute(): Promise<Order[]>;
}

export interface GetSellerOrderStatsUseCase {
  execute(): Promise<OrderStats>;
}

export const createListBuyerOrdersUseCase = (
  repository: IOrderRepository,
): ListBuyerOrdersUseCase => ({
  execute: () => repository.listBuyerOrders(),
});

export const createGetOrderUseCase = (
  repository: IOrderRepository,
): GetOrderUseCase => ({
  execute: (orderId: number) => repository.getOrder(orderId),
});

export const createCreateOrderUseCase = (
  repository: IOrderRepository,
): CreateOrderUseCase => ({
  execute: (request: CreateOrderRequest) => repository.createOrder(request),
});

export const createUpdateOrderStatusUseCase = (
  repository: IOrderRepository,
): UpdateOrderStatusUseCase => ({
  execute: (orderId: number, request: UpdateOrderStatusRequest) =>
    repository.updateOrderStatus(orderId, request),
});

export const createConfirmOrderUseCase = (
  repository: IOrderRepository,
): ConfirmOrderUseCase => ({
  execute: (orderId: number) => repository.confirmOrder(orderId),
});

export const createListSellerOrdersUseCase = (
  repository: IOrderRepository,
): ListSellerOrdersUseCase => ({
  execute: () => repository.listSellerOrders(),
});

export const createGetSellerOrderStatsUseCase = (
  repository: IOrderRepository,
): GetSellerOrderStatsUseCase => ({
  execute: () => repository.getSellerOrderStats(),
});
