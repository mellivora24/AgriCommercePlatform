import type { Return, ReturnListResponse } from '../../domain/entities/return.entity';
import type { ReturnDTO, ReturnListResponseDTO } from '../api/returns.api';

export const ReturnMapper = {
  toEntity: (dto: ReturnDTO): Return => dto,
  toListEntity: (dto: ReturnListResponseDTO): ReturnListResponse => dto,
};
