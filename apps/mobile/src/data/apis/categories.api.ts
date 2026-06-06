import { axiosInstance } from '@/core/axios/axiosInstance';
import type { CategoryDTO } from '../dtos/category.dto';

export const categoriesApi = {
  listCategories: async (): Promise<CategoryDTO[]> => {
    const response = await axiosInstance.get<CategoryDTO[]>('/categories');
    return response.data;
  },
};
