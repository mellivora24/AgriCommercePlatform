import type { IProductRepository } from '../repositories/product.repository';
import type { CreateProductPayload, UpdateProductPayload } from '@/data/apis/products.api';

export const createListProductsUseCase = (repository: IProductRepository) => ({
  execute: async (page?: number, limit?: number, categoryId?: number) =>
    repository.listProducts(page, limit, categoryId),
});

export const createGetProductUseCase = (repository: IProductRepository) => ({
  execute: async (id: string | number) => repository.getProduct(id),
});

export const createSearchProductsUseCase = (repository: IProductRepository) => ({
  execute: async (query: string, page?: number, limit?: number) =>
    repository.searchProducts(query, page, limit),
});

export const createGetMyProductsUseCase = (repository: IProductRepository) => ({
  execute: async () => repository.getMyProducts(),
});

export const createSearchSimilarUseCase = (repository: IProductRepository) => ({
  execute: async (name: string, limit?: number) => repository.searchSimilar(name, limit),
});

export const createCreateProductUseCase = (repository: IProductRepository) => ({
  execute: async (payload: CreateProductPayload) => repository.createProduct(payload),
});

export const createUpdateProductUseCase = (repository: IProductRepository) => ({
  execute: async (id: number, payload: UpdateProductPayload) =>
    repository.updateProduct(id, payload),
});

export const createUpdateProductStatusUseCase = (repository: IProductRepository) => ({
  execute: async (id: number, status: 'AVAILABLE' | 'HIDDEN' | 'OUT_OF_STOCK' | 'PENDING') =>
    repository.updateProductStatus(id, status),
});

export const createDeleteProductUseCase = (repository: IProductRepository) => ({
  execute: async (id: number) => repository.deleteProduct(id),
});

export const createAddProductImageUseCase = (repository: IProductRepository) => ({
  execute: async (id: number, imageUrl: string) => repository.addProductImage(id, imageUrl),
});

export const createRemoveProductImageUseCase = (repository: IProductRepository) => ({
  execute: async (productId: number, imageId: number) =>
    repository.removeProductImage(productId, imageId),
});
