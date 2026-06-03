import type { CategoryDTO } from '../dtos/category.dto';
import type { Category } from '@/domain/entities/category.entity';

export const CategoryMapper = {
  toEntity: (dto: CategoryDTO): Category => ({
    categoryId: dto.categoryId,
    name: dto.name,
    slug: dto.slug,
    imageUrl: dto.imageUrl,
  }),
};
