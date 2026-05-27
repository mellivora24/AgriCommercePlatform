import { axiosInstance } from '../../../../core/network';
import type { ProductListResponse } from '../../domain/entities/product.entity';

export const productsApi = {
  getProducts: async (
    page: number = 1,
    limit: number = 20,
    categoryId?: number,
  ) => {
    const params: Record<string, number> = {
      page,
      limit,
    };

    if (categoryId) {
      params.categoryId = categoryId;
    }

    const response = await axiosInstance.get<ProductListResponse>(
      '/products',
      { params },
    );

    console.log('Products API Response:', response.data);

    return response.data;
  },

  getProduct: async (id: string) => {
    const response = await axiosInstance.get(`/products/${id}`);

    console.log('Product API Response:', response.data);

    return response.data;
  },

  searchProducts: async (
    query: string,
    page: number = 1,
  ) => {
    const response = await axiosInstance.get<ProductListResponse>(
      '/products/search',
      {
        params: {
          q: query,
          page,
        },
      },
    );

    console.log('Search Products API Response:', response.data);

    return response.data;
  },
};
