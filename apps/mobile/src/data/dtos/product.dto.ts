import type { CategoryDTO } from "./category.dto";

export interface ProductImageDTO {
  imageId?: number;
  imageUrl: string;
}

export interface ProductSellerDTO {
  sellerId: number;
  userId: number;
  storeName: string;
  storeDescription: string | null;
  platformFeeRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDTO {
  productId: number;
  name: string;
  description: string;
  price: string;
  stockQuantity: number;
  status: "AVAILABLE" | "HIDDEN" | "OUT_OF_STOCK" | "PENDING";
  rating: number | null;
  reviews: number;
  sellerId: number;
  categoryId: number;
  images: ProductImageDTO[];
  seller: ProductSellerDTO;
  category: CategoryDTO | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponseDTO {
  items: ProductDTO[];
  total: number;
  page: number;
  limit: number;
}
