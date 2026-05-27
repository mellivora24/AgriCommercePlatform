import { useQuery, useMutation } from '@tanstack/react-query';
import type { CreateCategoryRequest, UpdateCategoryRequest } from '../../domain/entities/category.entity';
import { axiosInstance } from '@/core/network/axios.instance';
import { createCategoriesApi } from '../../data/api/categories.api';
import { createCategoryRepository } from '../../data/repositories/category.repository.impl';
import {
  createListCategoriesUseCase,
  createGetCategoryUseCase,
  createCreateCategoryUseCase,
  createUpdateCategoryUseCase,
  createDeleteCategoryUseCase,
} from '../../domain/use-cases/category.use-case';

const categoriesApi = createCategoriesApi(axiosInstance);
const categoryRepository = createCategoryRepository(categoriesApi);

export const useListCategories = () => {
  const useCase = createListCategoriesUseCase(categoryRepository);
  return useQuery({
    queryKey: ['categories', 'list'],
    queryFn: () => useCase.execute(),
  });
};

export const useGetCategory = (categoryId: number | null) => {
  const useCase = createGetCategoryUseCase(categoryRepository);
  return useQuery({
    queryKey: ['categories', categoryId],
    queryFn: () => useCase.execute(categoryId!),
    enabled: !!categoryId,
  });
};

export const useCreateCategory = () => {
  const useCase = createCreateCategoryUseCase(categoryRepository);
  return useMutation({
    mutationFn: (request: CreateCategoryRequest) => useCase.execute(request),
  });
};

export const useUpdateCategory = () => {
  const useCase = createUpdateCategoryUseCase(categoryRepository);
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateCategoryRequest }) =>
      useCase.execute(id, request),
  });
};

export const useDeleteCategory = () => {
  const useCase = createDeleteCategoryUseCase(categoryRepository);
  return useMutation({
    mutationFn: (id: number) => useCase.execute(id),
  });
};
