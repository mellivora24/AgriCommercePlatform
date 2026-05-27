import type { ICategoryRepository } from '../../domain/repositories/category.repository';
import type { CategoriesApi } from '../api/categories.api';

export const createCategoryRepository = (categoriesApi: CategoriesApi): ICategoryRepository => ({
  listCategories: () => categoriesApi.listCategories(),
  getCategory: (id) => categoriesApi.getCategory(id),
  createCategory: (request) => categoriesApi.createCategory(request),
  updateCategory: (id, request) => categoriesApi.updateCategory(id, request),
  deleteCategory: (id) => categoriesApi.deleteCategory(id),
});
