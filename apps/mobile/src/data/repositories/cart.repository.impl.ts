import type { ICartRepository } from '@/domain/repositories/cart.repository';
import type { CartResponse } from '@/domain/entities/cart.entity';
import { cartApi } from '../apis/cart.api';
import { CartMapper } from '../mappers/cart.mapper';

export class CartRepositoryImpl implements ICartRepository {
  async getCartItems(): Promise<CartResponse> {
    const dto = await cartApi.getCartItems();
    return CartMapper.toResponseEntity(dto);
  }

  async addToCart(item: { productId: number; quantity: number }): Promise<CartResponse> {
    const dto = await cartApi.addToCart(item);
    return CartMapper.toResponseEntity(dto);
  }

  async updateCartItem(item: { productId: number; quantity: number }): Promise<CartResponse> {
    const dto = await cartApi.updateCartItem(item);
    return CartMapper.toResponseEntity(dto);
  }

  async removeFromCart(itemId: number): Promise<CartResponse> {
    const dto = await cartApi.removeFromCart({ itemId });
    return CartMapper.toResponseEntity(dto);
  }
}
