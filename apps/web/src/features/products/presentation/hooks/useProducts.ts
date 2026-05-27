import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '../../../../core/constants';
import { productsApi } from '../../data/api/products.api';

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
