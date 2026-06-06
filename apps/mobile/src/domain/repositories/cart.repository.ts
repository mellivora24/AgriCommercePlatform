import type { CartItem, CartResponse } from '../entities/cart.entity';

export interface ICartRepository {
  getCartItems(): Promise<CartResponse>;
  addToCart(item: Pick<CartItem, 'productId' | 'quantity'>): Promise<CartResponse>;
  updateCartItem(item: Pick<CartItem, 'productId' | 'quantity'>): Promise<CartResponse>;
  removeFromCart(productId: number): Promise<CartResponse>;
}
