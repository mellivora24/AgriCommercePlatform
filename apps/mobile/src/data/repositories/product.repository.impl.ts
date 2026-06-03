import { productsApi } from '../apis/products.api';
import { ProductMapper } from '../mappers/product.mapper';
import type { IProductRepository } from '@/domain/repositories/product.repository';
import type { Product, ProductListResponse } from '@/domain/entities/product.entity';

export class ProductRepositoryImpl implements IProductRepository {
  async listProducts(page = 1, limit = 20, categoryId?: number): Promise<ProductListResponse> {
    const dto = await productsApi.getProducts(page, limit, categoryId);
    return ProductMapper.toListEntity(dto);
  }

  async getProduct(id: string | number): Promise<Product> {
    const dto = await productsApi.getProduct(id);
    return ProductMapper.toEntity(dto);
  }
}
