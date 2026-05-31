import { axiosInstance } from '../../../../core/network';
import type { ProductListResponse, Product } from '../../domain/entities/product.entity';

export const productsApi = {
  getProducts: async (
    page: number = 1,
    limit: number = 20,
    categoryId?: number,
    sellerId?: number,
  ) => {
    const params: Record<string, number> = {
      page,
      limit,
    };

    if (categoryId) {
      params.categoryId = categoryId;
    }

    if (sellerId) {
      params.sellerId = sellerId;
    }

    const response = await axiosInstance.get<ProductListResponse>(
      '/products',
      { params },
    );

    return response.data;
  },

  getProduct: async (id: string | number) => {
    const response = await axiosInstance.get<Product>(`/products/${id}`);

    return response.data;
  },

  searchProducts: async (
    query: string,
    page: number = 1,
    limit: number = 20,
  ) => {
    const response = await axiosInstance.get<ProductListResponse>(
      '/products',
      {
        params: {
          q: query,
          page,
          limit,
        },
      },
    );

    return response.data;
  },

  getMyProducts: async () => {
    const response = await axiosInstance.get<Product[]>('/products/seller/me');

    return response.data;
  },

  searchSimilar: async (name: string, limit: number = 10) => {
    const response = await axiosInstance.get<Product[]>('/products/similar', {
      params: { name, limit },
    });

    return response.data;
  },
};
