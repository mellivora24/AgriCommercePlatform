import { categoriesApi } from '../apis/categories.api';
import { CategoryMapper } from '../mappers/category.mapper';
import type { ICategoryRepository } from '@/domain/repositories/category.repository';
import type { Category } from '@/domain/entities/category.entity';

export class CategoryRepositoryImpl implements ICategoryRepository {
  async listCategories(): Promise<Category[]> {
    const dtoList = await categoriesApi.listCategories();
    return dtoList.map((dto) => CategoryMapper.toEntity(dto));
  }
}
