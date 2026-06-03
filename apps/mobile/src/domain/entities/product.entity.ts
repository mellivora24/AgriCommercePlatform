import type { Category } from './category.entity';

export interface ProductImage {
  imageId?: number;
  imageUrl: string;
}

export interface ProductSeller {
  sellerId?: number;
  storeName?: string;
  name?: string;
}

export interface Product {
  productId: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  rating?: number;
  sku?: string;
  images?: ProductImage[];
  seller?: ProductSeller;
  category?: Category;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}
