import { axiosInstance } from '@/core/axios/axiosInstance';
import type { ProductDTO, ProductListResponseDTO } from '@/data/dtos/product.dto';
import type { ProductImage } from '@/domain/entities/product.entity';

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  stockQuantity?: number;
  categoryId?: number;
  images?: { imageUrl: string }[];
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  stockQuantity?: number;
  categoryId?: number;
  status?: 'AVAILABLE' | 'HIDDEN' | 'OUT_OF_STOCK' | 'PENDING';
  images?: { imageUrl: string }[];
}

export const productsApi = {
  getProducts: async (
    page: number = 1,
    limit: number = 20,
    categoryId?: number,
    sellerId?: number,
  ) => {
    console.log('Fetching 8 products in home page');

    const params: Record<string, number> = { page, limit };
    if (categoryId) params.categoryId = categoryId;
    if (sellerId) params.sellerId = sellerId;
    const response = await axiosInstance.get<ProductListResponseDTO>('/products', { params });

    // console.log('Fetched products:', response.data);

    return response.data;
  },

  getProduct: async (id: string | number) => {
    const response = await axiosInstance.get<ProductDTO>(`/products/${id}`);
    return response.data;
  },

  searchProducts: async (query: string, page: number = 1, limit: number = 20) => {
    const response = await axiosInstance.get<ProductListResponseDTO>('/products', {
      params: { q: query, page, limit },
    });
    return response.data;
  },

  getMyProducts: async () => {
    const response = await axiosInstance.get<ProductDTO[]>('/products/seller/me');
    return response.data;
  },

  searchSimilar: async (name: string, limit: number = 10) => {
    const response = await axiosInstance.get<ProductDTO[]>('/products/similar', {
      params: { name, limit },
    });
    return response.data;
  },

  createProduct: async (payload: CreateProductPayload) => {
    const response = await axiosInstance.post<ProductDTO>('/products', payload);
    return response.data;
  },

  updateProduct: async (id: number, payload: UpdateProductPayload) => {
    const response = await axiosInstance.put<ProductDTO>(`/products/${id}`, payload);
    return response.data;
  },

  updateProductStatus: async (
    id: number,
    status: 'AVAILABLE' | 'HIDDEN' | 'OUT_OF_STOCK' | 'PENDING',
  ) => {
    const response = await axiosInstance.put<ProductDTO>(`/products/${id}/status`, { status });
    return response.data;
  },

  deleteProduct: async (id: number) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  },

  addProductImage: async (id: number, imageUrl: string) => {
    const response = await axiosInstance.post<ProductImage>(`/products/${id}/images`, {
      imageUrl,
    });
    return response.data;
  },

  removeProductImage: async (productId: number, imageId: number) => {
    const response = await axiosInstance.delete(`/products/${productId}/images/${imageId}`);
    return response.data;
  },
};
