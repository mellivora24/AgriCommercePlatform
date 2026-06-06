import type { Category } from "./category.entity";

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
  description: string;
  price: number;
  stockQuantity: number;
  status: "AVAILABLE" | "HIDDEN" | "OUT_OF_STOCK" | "PENDING";
  rating: number | null;
  reviews: number;
  sellerId: number;
  categoryId: number | null;
  images: ProductImage[];
  seller: ProductSeller;
  category: Category | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}
