import type { IOrderRepository, CreateOrderPayload, GetSellerOrdersParams } from '@/domain/repositories/order.repository';

export const createOrderUseCase = (repository: IOrderRepository) => ({
  execute: (payload: CreateOrderPayload) => repository.createOrder(payload),
});

export const createGetOrderUseCase = (repository: IOrderRepository) => ({
  execute: (orderId: number) => repository.getOrder(orderId),
});

export const createListBuyerOrdersUseCase = (repository: IOrderRepository) => ({
  execute: () => repository.listBuyerOrders(),
});

export const createListSellerOrdersUseCase = (repository: IOrderRepository) => ({
  execute: (params: GetSellerOrdersParams) => repository.listSellerOrders(params),
});

export const createGetSellerOrderStatsUseCase = (repository: IOrderRepository) => ({
  execute: () => repository.getSellerOrderStats(),
});

export const createUpdateOrderStatusUseCase = (repository: IOrderRepository) => ({
  execute: (orderId: number, status: string) => repository.updateOrderStatus(orderId, status),
});

export const createConfirmOrderUseCase = (repository: IOrderRepository) => ({
  execute: (orderId: number) => repository.confirmOrder(orderId),
});

export const createCancelOrderUseCase = (repository: IOrderRepository) => ({
  execute: (orderId: number) => repository.cancelOrder(orderId),
});
