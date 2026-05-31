import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../entities/category.entity';

export interface ICategoryRepository {
  listCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category>;
  createCategory(request: CreateCategoryRequest): Promise<Category>;
  updateCategory(id: number, request: UpdateCategoryRequest): Promise<Category>;
  deleteCategory(id: number): Promise<void>;
}
