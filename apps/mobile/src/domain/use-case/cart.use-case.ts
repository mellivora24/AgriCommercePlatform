import type { ICartRepository } from '../repositories/cart.repository';

export const createGetCartUseCase = (repository: ICartRepository) => ({
  execute: async () => repository.getCartItems(),
});

export const createAddToCartUseCase = (repository: ICartRepository) => ({
  execute: async (productId: number, quantity: number) => repository.addToCart({ productId, quantity }),
});

export const createUpdateCartItemUseCase = (repository: ICartRepository) => ({
  execute: async (productId: number, quantity: number) => repository.updateCartItem({ productId, quantity }),
});

export const createRemoveFromCartUseCase = (repository: ICartRepository) => ({
  execute: async (productId: number) => repository.removeFromCart(productId),
});
