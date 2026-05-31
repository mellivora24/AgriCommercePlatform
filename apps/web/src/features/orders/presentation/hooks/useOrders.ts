import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateOrderRequest,
  UpdateOrderStatusRequest,
} from "@/features/orders/domain/entities/order.entity";
import { axiosInstance } from "@/core/network/axios.instance";
import { createOrdersApi } from "@/features/orders/data/api/orders.api";
import { createOrderRepository } from "@/features/orders/data/repositories/order.repository.impl";
import {
  createListBuyerOrdersUseCase,
  createGetOrderUseCase,
  createCreateOrderUseCase,
  createUpdateOrderStatusUseCase,
  createConfirmOrderUseCase,
  createListSellerOrdersUseCase,
  createGetSellerOrderStatsUseCase,
} from "@/features/orders/domain/use-cases/order.use-case";
import { QUERY_KEYS } from "@/core/constants/query-keys";

const ordersApi = createOrdersApi(axiosInstance);
const orderRepository = createOrderRepository(ordersApi);

export const useListBuyerOrders = () => {
  const useCase = createListBuyerOrdersUseCase(orderRepository);
  return useQuery({
    queryKey: QUERY_KEYS.ORDERS_LIST,
    queryFn: () => useCase.execute(),
  });
};

export const useGetOrder = (orderId: number | undefined) => {
  const useCase = createGetOrderUseCase(orderRepository);
  return useQuery({
    queryKey: QUERY_KEYS.ORDERS_DETAIL(orderId!),
    queryFn: () => useCase.execute(orderId!),
    enabled: !!orderId,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const useCase = createCreateOrderUseCase(orderRepository);

  return useMutation({
    mutationFn: (request: CreateOrderRequest) => useCase.execute(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS_LIST });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const useCase = createUpdateOrderStatusUseCase(orderRepository);

  return useMutation({
    mutationFn: ({
      orderId,
      request,
    }: {
      orderId: number;
      request: UpdateOrderStatusRequest;
    }) => useCase.execute(orderId, request),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ORDERS_DETAIL(orderId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS_LIST });
    },
  });
};

export const useConfirmOrder = () => {
  const queryClient = useQueryClient();
  const useCase = createConfirmOrderUseCase(orderRepository);

  return useMutation({
    mutationFn: (orderId: number) => useCase.execute(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ORDERS_DETAIL(orderId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS_LIST });
    },
  });
};

export const useListSellerOrders = () => {
  const useCase = createListSellerOrdersUseCase(orderRepository);
  return useQuery({
    queryKey: QUERY_KEYS.SELLER_ORDERS_LIST,
    queryFn: () => useCase.execute(),
  });
};

export const useSellerOrderStats = () => {
  const useCase = createGetSellerOrderStatsUseCase(orderRepository);
  return useQuery({
    queryKey: QUERY_KEYS.SELLER_ORDER_STATS,
    queryFn: () => useCase.execute(),
  });
};
