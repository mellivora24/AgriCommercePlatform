import type { Product, ProductListResponse } from '../entities/product.entity';

export interface IProductRepository {
  listProducts(page?: number, limit?: number, categoryId?: number): Promise<ProductListResponse>;
  getProduct(id: string | number): Promise<Product>;
}
