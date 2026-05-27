import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../../core/constants';
import { productsApi } from '../../data/api/products.api';

export const useProducts = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS_LIST(page, limit),
    queryFn: () => productsApi.getProducts(page, limit),
  });
};

export const useProductDetail = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS_DETAIL(id),
    queryFn: () => productsApi.getProduct(id),
    enabled: !!id,
  });
};

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS_SEARCH(query),
    queryFn: () => productsApi.searchProducts(query),
    enabled: query.length > 0,
  });
};
