import type { ICategoryRepository } from '../repositories/category.repository';

export const createListCategoriesUseCase = (repository: ICategoryRepository) => ({
  execute: async () => repository.listCategories(),
});
