import type { ProductDTO, ProductListResponseDTO } from '../dtos/product.dto';
import type { Product, ProductListResponse } from '@/domain/entities/product.entity';

export const ProductMapper = {
  toEntity: (dto: ProductDTO): Product => ({
    productId: dto.productId,
    name: dto.name,
    description: dto.description,
    price: dto.price,
    stockQuantity: dto.stockQuantity,
    rating: dto.rating,
    sku: dto.sku,
    images: dto.images,
    seller: dto.seller,
    category: dto.category,
  }),
  toListEntity: (dto: ProductListResponseDTO): ProductListResponse => ({
    items: dto.items.map((item) => ProductMapper.toEntity(item)),
    total: dto.total,
    page: dto.page,
    limit: dto.limit,
  }),
};
