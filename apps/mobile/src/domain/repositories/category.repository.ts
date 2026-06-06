import type { Category } from '../entities/category.entity';

export interface ICategoryRepository {
  listCategories(): Promise<Category[]>;
}
