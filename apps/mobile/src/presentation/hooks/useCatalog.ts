import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CategoryRepositoryImpl } from '@/data/repositories/category.repository.impl';
import { ProductRepositoryImpl } from '@/data/repositories/product.repository.impl';
import { createListCategoriesUseCase } from '@/domain/use-case/category.use-case';
import {
  createAddProductImageUseCase,
  createCreateProductUseCase,
  createDeleteProductUseCase,
  createGetMyProductsUseCase,
  createGetProductUseCase,
  createListProductsUseCase,
  createRemoveProductImageUseCase,
  createSearchProductsUseCase,
  createSearchSimilarUseCase,
  createUpdateProductStatusUseCase,
  createUpdateProductUseCase,
} from '@/domain/use-case/product.use-case';
import type { CreateProductPayload, UpdateProductPayload } from '@/data/apis/products.api';

const categoryRepository = new CategoryRepositoryImpl();
const productRepository = new ProductRepositoryImpl();

const listCategoriesUseCase = createListCategoriesUseCase(categoryRepository);
const listProductsUseCase = createListProductsUseCase(productRepository);
const getProductUseCase = createGetProductUseCase(productRepository);
const searchProductsUseCase = createSearchProductsUseCase(productRepository);
const getMyProductsUseCase = createGetMyProductsUseCase(productRepository);
const searchSimilarUseCase = createSearchSimilarUseCase(productRepository);
const createProductUseCase = createCreateProductUseCase(productRepository);
const updateProductUseCase = createUpdateProductUseCase(productRepository);
const updateProductStatusUseCase = createUpdateProductStatusUseCase(productRepository);
const deleteProductUseCase = createDeleteProductUseCase(productRepository);
const addProductImageUseCase = createAddProductImageUseCase(productRepository);
const removeProductImageUseCase = createRemoveProductImageUseCase(productRepository);

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (page: number, limit: number, categoryId?: number) =>
    [...productKeys.lists(), { page, limit, categoryId }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...productKeys.details(), id] as const,
  search: (query: string, page: number, limit: number) =>
    [...productKeys.all, 'search', { query, page, limit }] as const,
  similar: (name: string, limit: number) =>
    [...productKeys.all, 'similar', { name, limit }] as const,
  mine: () => [...productKeys.all, 'mine'] as const,
};

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: () => listCategoriesUseCase.execute(),
  });

export const useProducts = (page = 1, limit = 20, categoryId?: number) =>
  useQuery({
    queryKey: productKeys.list(page, limit, categoryId),
    queryFn: () => listProductsUseCase.execute(page, limit, categoryId),
  });

export const useProductDetail = (id?: string | number) =>
  useQuery({
    queryKey: productKeys.detail(id!),
    queryFn: () => getProductUseCase.execute(id as string | number),
    enabled: id !== undefined && id !== null && id !== '',
  });

export const useSearchProducts = (query: string, page = 1, limit = 20) =>
  useQuery({
    queryKey: productKeys.search(query, page, limit),
    queryFn: () => searchProductsUseCase.execute(query, page, limit),
    enabled: query.trim().length > 0,
  });

export const useMyProducts = () =>
  useQuery({
    queryKey: productKeys.mine(),
    queryFn: () => getMyProductsUseCase.execute(),
  });

export const useSimilarProducts = (name: string, limit = 10) =>
  useQuery({
    queryKey: productKeys.similar(name, limit),
    queryFn: () => searchSimilarUseCase.execute(name, limit),
    enabled: name.trim().length > 0,
  });

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductPayload) => createProductUseCase.execute(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.mine() });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateProductPayload }) =>
      updateProductUseCase.execute(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.setQueryData(productKeys.detail(data.productId), data);
    },
  });
};

export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: 'AVAILABLE' | 'HIDDEN' | 'OUT_OF_STOCK' | 'PENDING';
    }) => updateProductStatusUseCase.execute(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.setQueryData(productKeys.detail(data.productId), data);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProductUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

export const useAddProductImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, imageUrl }: { id: number; imageUrl: string }) =>
      addProductImageUseCase.execute(id, imageUrl),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
    },
  });
};

export const useRemoveProductImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, imageId }: { productId: number; imageId: number }) =>
      removeProductImageUseCase.execute(productId, imageId),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
    },
  });
};
