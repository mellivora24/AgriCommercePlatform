import type { IOrderRepository } from '@/domain/repositories/order.repository';
export const createListOrdersUseCase = (repository: IOrderRepository) => ({
  execute: async () => repository.listOrders(),
});

export const createGetOrderUseCase = (repository: IOrderRepository) => ({
  execute: async (orderId: number) => repository.getOrder(orderId),
});
