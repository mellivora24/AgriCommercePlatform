import { productsApi } from '../apis/products.api';
import { ProductMapper } from '../mappers/product.mapper';
import type { IProductRepository } from '@/domain/repositories/product.repository';
import type { Product, ProductImage, ProductListResponse } from '@/domain/entities/product.entity';
import type { CreateProductPayload, UpdateProductPayload } from '../apis/products.api';

export class ProductRepositoryImpl implements IProductRepository {
  async listProducts(page = 1, limit = 20, categoryId?: number): Promise<ProductListResponse> {
    const dto = await productsApi.getProducts(page, limit, categoryId);
    return ProductMapper.toListEntity(dto);
  }

  async getProduct(id: string | number): Promise<Product> {
    const dto = await productsApi.getProduct(id);
    return ProductMapper.toEntity(dto);
  }

  async searchProducts(query: string, page = 1, limit = 20): Promise<ProductListResponse> {
    const dto = await productsApi.searchProducts(query, page, limit);
    return ProductMapper.toListEntity(dto);
  }

  async getMyProducts(): Promise<Product[]> {
    const dtos = await productsApi.getMyProducts();
    return dtos.map(ProductMapper.toEntity);
  }

  async searchSimilar(name: string, limit = 10): Promise<Product[]> {
    const dtos = await productsApi.searchSimilar(name, limit);
    return dtos.map(ProductMapper.toEntity);
  }

  async createProduct(payload: CreateProductPayload): Promise<Product> {
    const dto = await productsApi.createProduct(payload);
    return ProductMapper.toEntity(dto);
  }

  async updateProduct(id: number, payload: UpdateProductPayload): Promise<Product> {
    const dto = await productsApi.updateProduct(id, payload);
    return ProductMapper.toEntity(dto);
  }

  async updateProductStatus(
    id: number,
    status: 'AVAILABLE' | 'HIDDEN' | 'OUT_OF_STOCK' | 'PENDING',
  ): Promise<Product> {
    const dto = await productsApi.updateProductStatus(id, status);
    return ProductMapper.toEntity(dto);
  }

  async deleteProduct(id: number): Promise<void> {
    await productsApi.deleteProduct(id);
  }

  async addProductImage(id: number, imageUrl: string): Promise<ProductImage> {
    return productsApi.addProductImage(id, imageUrl);
  }

  async removeProductImage(productId: number, imageId: number): Promise<void> {
    await productsApi.removeProductImage(productId, imageId);
  }
}
