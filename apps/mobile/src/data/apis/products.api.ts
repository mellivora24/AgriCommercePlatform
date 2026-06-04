import { axiosInstance } from '@/core/axios/axiosInstance';
import type { ProductDTO, ProductListResponseDTO } from '../dtos/product.dto';

export const productsApi = {
  getProducts: async (page = 1, limit = 20, categoryId?: number): Promise<ProductListResponseDTO> => {
    const params: Record<string, number> = { page, limit };

    if (categoryId) {
      params.categoryId = categoryId;
    }

    const response = await axiosInstance.get<ProductListResponseDTO>('/products', { params });
    return response.data;
  },
  getProduct: async (id: string | number): Promise<ProductDTO> => {
    const response = await axiosInstance.get<ProductDTO>(`/products/${id}`);
    return response.data;
  },
};
