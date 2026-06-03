import type { ICartRepository } from '@/domain/repositories/cart.repository';
import type { CartItem, CartResponse } from '@/domain/entities/cart.entity';
import { cartApi } from '../apis/cart.api';
import { CartMapper } from '../mappers/cart.mapper';

export class CartRepositoryImpl implements ICartRepository {
  async getCartItems(): Promise<CartResponse> {
    const dto = await cartApi.getCartItems();
    return CartMapper.toResponseEntity(dto);
  }

  async addToCart(item: Pick<CartItem, 'productId' | 'quantity'>): Promise<CartResponse> {
    const dto = await cartApi.addToCart(item);
    return CartMapper.toResponseEntity(dto);
  }

  async updateCartItem(item: Pick<CartItem, 'productId' | 'quantity'>): Promise<CartResponse> {
    const dto = await cartApi.updateCartItem(item);
    return CartMapper.toResponseEntity(dto);
  }

  async removeFromCart(productId: number): Promise<CartResponse> {
    const dto = await cartApi.removeFromCart({ productId });
    return CartMapper.toResponseEntity(dto);
  }
}
