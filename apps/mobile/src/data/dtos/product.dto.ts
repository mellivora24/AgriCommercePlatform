import type { CategoryDTO } from './category.dto';

export interface ProductImageDTO {
  imageId?: number;
  imageUrl: string;
}

export interface ProductSellerDTO {
  sellerId?: number;
  storeName?: string;
  name?: string;
}

export interface ProductDTO {
  productId: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  rating?: number;
  sku?: string;
  images?: ProductImageDTO[];
  seller?: ProductSellerDTO;
  category?: CategoryDTO;
}

export interface ProductListResponseDTO {
  items: ProductDTO[];
  total: number;
  page: number;
  limit: number;
}
