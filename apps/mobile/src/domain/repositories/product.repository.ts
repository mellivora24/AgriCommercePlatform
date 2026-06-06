import type { Product, ProductListResponse } from '../entities/product.entity';
import type { CreateProductPayload, UpdateProductPayload } from '@/data/apis/products.api';
import type { ProductImage } from '../entities/product.entity';

export interface IProductRepository {
  listProducts(page?: number, limit?: number, categoryId?: number): Promise<ProductListResponse>;
  getProduct(id: string | number): Promise<Product>;
  searchProducts(query: string, page?: number, limit?: number): Promise<ProductListResponse>;
  getMyProducts(): Promise<Product[]>;
  searchSimilar(name: string, limit?: number): Promise<Product[]>;
  createProduct(payload: CreateProductPayload): Promise<Product>;
  updateProduct(id: number, payload: UpdateProductPayload): Promise<Product>;
  updateProductStatus(
    id: number,
    status: 'AVAILABLE' | 'HIDDEN' | 'OUT_OF_STOCK' | 'PENDING',
  ): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  addProductImage(id: number, imageUrl: string): Promise<ProductImage>;
  removeProductImage(productId: number, imageId: number): Promise<void>;
}
