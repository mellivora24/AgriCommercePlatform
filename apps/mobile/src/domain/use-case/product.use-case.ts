import type { IProductRepository } from '../repositories/product.repository';

export const createListProductsUseCase = (repository: IProductRepository) => ({
  execute: async (page?: number, limit?: number, categoryId?: number) =>
    repository.listProducts(page, limit, categoryId),
});

export const createGetProductUseCase = (repository: IProductRepository) => ({
  execute: async (id: string | number) => repository.getProduct(id),
});
