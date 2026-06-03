import type { CartItemDto, CartResponseDto } from '../dtos/cart.dto';
import type { CartItem, CartResponse } from '@/domain/entities/cart.entity';

export const CartMapper = {
  toEntity: (dto: CartItemDto): CartItem => ({
    productId: dto.productId,
    sellerId: dto.sellerId,
    name: dto.name,
    price: dto.price,
    quantity: dto.quantity,
    image: dto.image,
    sku: dto.sku,
  }),
  toResponseEntity: (dto: CartResponseDto): CartResponse => ({
    items: dto.items.map((item) => CartMapper.toEntity(item)),
    totalItems: dto.totalItems,
    subtotal: dto.subtotal,
  }),
};
