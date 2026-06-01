import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/core/constants';
import { productsApi } from '@/features/products/data/api/products.api';
import type {
  CreateProductPayload,
  UpdateProductPayload,
} from '@/features/products/data/api/products.api';

export const useProducts = (
  page: number = 1,
  limit: number = 20,
  categoryId?: number,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS_LIST(page, limit, categoryId),
    queryFn: () => productsApi.getProducts(page, limit, categoryId),
  });
};

export const useProductDetail = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS_DETAIL(id),
    queryFn: () => productsApi.getProduct(id),
    enabled: !!id,
  });
};

export const useSearchProducts = (
  query: string,
  page: number = 1,
  limit: number = 20,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS_SEARCH(query, page, limit),
    queryFn: () => productsApi.searchProducts(query, page, limit),
    enabled: query.length > 0,
  });
};

export const useSearchSimilar = (name: string, limit: number = 10) => {
  return useQuery({
    queryKey: ['products', 'similar', name, limit],
    queryFn: () => productsApi.searchSimilar(name, limit),
    enabled: name.length > 0,
  });
};

export const useMyProducts = () => {
  return useQuery({
    queryKey: ['products', 'seller', 'me'],
    queryFn: () => productsApi.getMyProducts(),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductPayload) => productsApi.createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', 'seller', 'me'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateProductPayload }) =>
      productsApi.updateProduct(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products', 'seller', 'me'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS_DETAIL(String(id)) });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productsApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', 'seller', 'me'] });
    },
  });
};
