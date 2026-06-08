import type { ICartRepository } from '../repositories/cart.repository';

export const createGetCartUseCase = (repository: ICartRepository) => ({
  execute: () => repository.getCartItems(),
});

export const createAddToCartUseCase = (repository: ICartRepository) => ({
  execute: (productId: number, quantity: number) =>
    repository.addToCart({ productId, quantity }),
});

export const createUpdateCartItemUseCase = (repository: ICartRepository) => ({
  execute: (productId: number, quantity: number) =>
    repository.updateCartItem({ productId, quantity }),
});

export const createRemoveFromCartUseCase = (repository: ICartRepository) => ({
  execute: (itemId: number) => repository.removeFromCart(itemId),
});
