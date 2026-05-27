import { useMutation, useQuery } from '@tanstack/react-query';
import type { CreateOrderRequest, UpdateOrderStatusRequest } from '../../domain/entities/order.entity';
import { axiosInstance } from '@/core/network/axios.instance';
import { createOrdersApi } from '../../data/api/orders.api';
import { createOrderRepository } from '../../data/repositories/order.repository.impl';
import {
  createListOrdersUseCase,
  createGetOrderUseCase,
  createCreateOrderUseCase,
  createUpdateOrderStatusUseCase,
} from '../../domain/use-cases/order.use-case';
import { QUERY_KEYS } from '@/core/constants/query-keys';

const ordersApi = createOrdersApi(axiosInstance);
const orderRepository = createOrderRepository(ordersApi);

export const useListOrders = (page: number = 1, limit: number = 10) => {
  const useCase = createListOrdersUseCase(orderRepository);

  return useQuery({
    queryKey: QUERY_KEYS.ORDERS_LIST(page, limit),
    queryFn: () => useCase.execute(page, limit),
  });
};

export const useGetOrder = (orderId: string) => {
  const useCase = createGetOrderUseCase(orderRepository);

  return useQuery({
    queryKey: QUERY_KEYS.ORDERS_DETAIL(orderId),
    queryFn: () => useCase.execute(orderId),
    enabled: !!orderId,
  });
};

export const useCreateOrder = () => {
  const useCase = createCreateOrderUseCase(orderRepository);

  return useMutation({
    mutationFn: (request: CreateOrderRequest) => useCase.execute(request),
  });
};

export const useUpdateOrderStatus = () => {
  const useCase = createUpdateOrderStatusUseCase(orderRepository);

  return useMutation({
    mutationFn: ({ orderId, request }: { orderId: string; request: UpdateOrderStatusRequest }) =>
      useCase.execute(orderId, request),
  });
};
