import type { ProductDTO, ProductListResponseDTO } from "../dtos/product.dto";
import type {
  Product,
  ProductListResponse,
} from "@/domain/entities/product.entity";

export const ProductMapper = {
  toEntity: (dto: ProductDTO): Product => ({
    productId: dto.productId,
    name: dto.name,
    description: dto.description,
    price: Number(dto.price),
    stockQuantity: dto.stockQuantity,
    status: dto.status,
    rating: dto.rating,
    reviews: dto.reviews,
    sellerId: dto.sellerId,
    categoryId: dto.categoryId,
    images: dto.images,
    seller: dto.seller,
    category: dto.category,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  }),
  toListEntity: (dto: ProductListResponseDTO): ProductListResponse => ({
    items: dto.items.map((item) => ProductMapper.toEntity(item)),
    total: dto.total,
    page: dto.page,
    limit: dto.limit,
  }),
};
