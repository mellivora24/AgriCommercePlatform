import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../entities/category.entity';
import type { ICategoryRepository } from '../repositories/category.repository';

export interface ListCategoriesUseCase {
  execute(): Promise<Category[]>;
}

export interface GetCategoryUseCase {
  execute(id: number): Promise<Category>;
}

export interface CreateCategoryUseCase {
  execute(request: CreateCategoryRequest): Promise<Category>;
}

export interface UpdateCategoryUseCase {
  execute(id: number, request: UpdateCategoryRequest): Promise<Category>;
}

export interface DeleteCategoryUseCase {
  execute(id: number): Promise<void>;
}

export const createListCategoriesUseCase = (repository: ICategoryRepository): ListCategoriesUseCase => ({
  execute: () => repository.listCategories(),
});

export const createGetCategoryUseCase = (repository: ICategoryRepository): GetCategoryUseCase => ({
  execute: (id) => repository.getCategory(id),
});

export const createCreateCategoryUseCase = (repository: ICategoryRepository): CreateCategoryUseCase => ({
  execute: (request) => repository.createCategory(request),
});

export const createUpdateCategoryUseCase = (repository: ICategoryRepository): UpdateCategoryUseCase => ({
  execute: (id, request) => repository.updateCategory(id, request),
});

export const createDeleteCategoryUseCase = (repository: ICategoryRepository): DeleteCategoryUseCase => ({
  execute: (id) => repository.deleteCategory(id),
});
