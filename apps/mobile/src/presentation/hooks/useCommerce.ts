import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CartRepositoryImpl } from '@/data/repositories/cart.repository.impl';
import { OrderRepositoryImpl } from '@/data/repositories/order.repository.impl';
import {
  createAddToCartUseCase,
  createGetCartUseCase,
  createRemoveFromCartUseCase,
  createUpdateCartItemUseCase,
} from '@/domain/use-case/cart.use-case';
import {
  createOrderUseCase,
  createGetOrderUseCase,
  createListBuyerOrdersUseCase,
  createListSellerOrdersUseCase,
  createGetSellerOrderStatsUseCase,
  createUpdateOrderStatusUseCase,
  createConfirmOrderUseCase,
  createCancelOrderUseCase,
} from '@/domain/use-case/order.use-case';
import type { CreateOrderPayload, GetSellerOrdersParams } from '@/domain/repositories/order.repository';

const cartRepository = new CartRepositoryImpl();
const orderRepository = new OrderRepositoryImpl();

const getCartUseCase = createGetCartUseCase(cartRepository);
const addToCartUseCase = createAddToCartUseCase(cartRepository);
const updateCartItemUseCase = createUpdateCartItemUseCase(cartRepository);
const removeFromCartUseCase = createRemoveFromCartUseCase(cartRepository);

const createOrderUseCaseInstance = createOrderUseCase(orderRepository);
const getOrderUseCase = createGetOrderUseCase(orderRepository);
const listBuyerOrdersUseCase = createListBuyerOrdersUseCase(orderRepository);
const listSellerOrdersUseCase = createListSellerOrdersUseCase(orderRepository);
const getSellerOrderStatsUseCase = createGetSellerOrderStatsUseCase(orderRepository);
const updateOrderStatusUseCase = createUpdateOrderStatusUseCase(orderRepository);
const confirmOrderUseCase = createConfirmOrderUseCase(orderRepository);
const cancelOrderUseCase = createCancelOrderUseCase(orderRepository);

export const useCartQuery = () =>
  useQuery({
    queryKey: ['cart'],
    queryFn: () => getCartUseCase.execute(),
  });

export const useBuyerOrders = () =>
  useQuery({
    queryKey: ['orders', 'buyer'],
    queryFn: () => listBuyerOrdersUseCase.execute(),
  });

export const useOrderDetail = (orderId?: number) =>
  useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => getOrderUseCase.execute(orderId as number),
    enabled: typeof orderId === 'number',
  });

export const useSellerOrders = (params: GetSellerOrdersParams) =>
  useQuery({
    queryKey: ['orders', 'seller', params],
    queryFn: () => listSellerOrdersUseCase.execute(params),
  });

export const useSellerOrderStats = () =>
  useQuery({
    queryKey: ['orders', 'seller', 'stats'],
    queryFn: () => getSellerOrderStatsUseCase.execute(),
  });

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrderUseCaseInstance.execute(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'buyer'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) =>
      updateOrderStatusUseCase.execute(orderId, status),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ['orders', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders', 'seller'] });
    },
  });
};

export const useConfirmOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number) => confirmOrderUseCase.execute(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['orders', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders', 'seller'] });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number) => cancelOrderUseCase.execute(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['orders', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders', 'seller'] });
    },
  });
};

export const commerceActions = {
  addToCart: addToCartUseCase.execute,
  updateCartItem: updateCartItemUseCase.execute,
  removeFromCart: removeFromCartUseCase.execute,
};
