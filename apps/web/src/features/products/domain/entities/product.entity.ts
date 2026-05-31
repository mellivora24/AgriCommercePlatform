export interface Category {
  categoryId: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Seller {
  sellerId: number;
  userId: number;
  storeName: string;
  storeDescription: string;
  platformFeeRate: string;
  createdAt?: string;
  updatedAt?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface ProductImage {
  imageId?: number;
  productId?: number;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  productId: number;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  images?: ProductImage[];
  category: Category;
  categoryId: number;
  sellerId: number;
  seller: Seller;
  stockQuantity: number;
  status: 'HIDDEN' | 'AVAILABLE' | 'OUT_OF_STOCK';
  rating?: number;
  reviews?: number;
  sku?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}
