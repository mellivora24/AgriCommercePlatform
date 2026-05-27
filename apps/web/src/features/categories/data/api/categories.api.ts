import type { AxiosInstance } from 'axios';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../domain/entities/category.entity';

export const createCategoriesApi = (axiosInstance: AxiosInstance) => ({
  listCategories: async (): Promise<Category[]> => {
    const { data } = await axiosInstance.get('/categories');
    return data;
  },

  getCategory: async (id: number): Promise<Category> => {
    const { data } = await axiosInstance.get(`/categories/${id}`);
    return data;
  },

  createCategory: async (request: CreateCategoryRequest): Promise<Category> => {
    const { data } = await axiosInstance.post('/categories', request);
    return data;
  },

  updateCategory: async (id: number, request: UpdateCategoryRequest): Promise<Category> => {
    const { data } = await axiosInstance.put(`/categories/${id}`, request);
    return data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/categories/${id}`);
  },
});

export type CategoriesApi = ReturnType<typeof createCategoriesApi>;
