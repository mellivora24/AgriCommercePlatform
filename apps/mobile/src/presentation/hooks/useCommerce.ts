import { useQuery } from '@tanstack/react-query';
import { CartRepositoryImpl } from '@/data/repositories/cart.repository.impl';
import { OrderRepositoryImpl } from '@/data/repositories/order.repository.impl';
import { createAddToCartUseCase, createGetCartUseCase, createRemoveFromCartUseCase, createUpdateCartItemUseCase } from '@/domain/use-case/cart.use-case';
import { createGetOrderUseCase, createListOrdersUseCase } from '@/domain/use-case/order.use-case';

const cartRepository = new CartRepositoryImpl();
const orderRepository = new OrderRepositoryImpl();
const getCartUseCase = createGetCartUseCase(cartRepository);
const addToCartUseCase = createAddToCartUseCase(cartRepository);
const updateCartItemUseCase = createUpdateCartItemUseCase(cartRepository);
const removeFromCartUseCase = createRemoveFromCartUseCase(cartRepository);
const listOrdersUseCase = createListOrdersUseCase(orderRepository);
const getOrderUseCase = createGetOrderUseCase(orderRepository);

export const useCartQuery = () =>
  useQuery({
    queryKey: ['cart'],
    queryFn: () => getCartUseCase.execute(),
  });

export const useOrders = () =>
  useQuery({
    queryKey: ['orders'],
    queryFn: () => listOrdersUseCase.execute(),
  });

export const useOrderDetail = (orderId?: number) =>
  useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderUseCase.execute(orderId as number),
    enabled: typeof orderId === 'number',
  });

export const commerceActions = {
  addToCart: addToCartUseCase.execute,
  updateCartItem: updateCartItemUseCase.execute,
  removeFromCart: removeFromCartUseCase.execute,
};
