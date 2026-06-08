import type { CartResponse } from '../entities/cart.entity';

export interface ICartRepository {
  getCartItems(): Promise<CartResponse>;
  addToCart(item: { productId: number; quantity: number }): Promise<CartResponse>;
  updateCartItem(item: { productId: number; quantity: number }): Promise<CartResponse>;
  removeFromCart(itemId: number): Promise<CartResponse>;
}
