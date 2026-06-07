import type { CartItemResponseDto, CartResponseDto } from '../dtos/cart.dto';
import type { CartItem, CartResponse } from '@/domain/entities/cart.entity';

export const CartMapper = {
  toItemEntity: (dto: CartItemResponseDto): CartItem => ({
    itemId: dto.itemId,
    productId: dto.productId,
    quantity: dto.quantity,
    name: dto.product.name,
    price: Number(dto.product.price),
    stockQuantity: dto.product.stockQuantity,
    image: dto.product.images?.[0]?.imageUrl,
    storeName: dto.product.seller?.storeName,
  }),

  toResponseEntity: (dto: CartResponseDto): CartResponse => ({
    cartId: dto.cartId,
    items: dto.items.map(CartMapper.toItemEntity),
  }),
};
