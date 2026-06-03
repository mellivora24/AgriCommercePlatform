import { useQuery } from '@tanstack/react-query';
import { CategoryRepositoryImpl } from '@/data/repositories/category.repository.impl';
import { ProductRepositoryImpl } from '@/data/repositories/product.repository.impl';
import { createListCategoriesUseCase } from '@/domain/use-case/category.use-case';
import { createGetProductUseCase, createListProductsUseCase } from '@/domain/use-case/product.use-case';

const categoryRepository = new CategoryRepositoryImpl();
const productRepository = new ProductRepositoryImpl();
const listCategoriesUseCase = createListCategoriesUseCase(categoryRepository);
const listProductsUseCase = createListProductsUseCase(productRepository);
const getProductUseCase = createGetProductUseCase(productRepository);

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: () => listCategoriesUseCase.execute(),
  });

export const useProducts = (page = 1, limit = 20, categoryId?: number) =>
  useQuery({
    queryKey: ['products', page, limit, categoryId],
    queryFn: () => listProductsUseCase.execute(page, limit, categoryId),
  });

export const useProductDetail = (id?: string | number) =>
  useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductUseCase.execute(id as string | number),
    enabled: id !== undefined && id !== null && id !== '',
  });
