import type { CreateReturnRequest } from '../../domain/entities/return.entity';
import type { IReturnRepository } from '../../domain/repositories/return.repository';
import { ReturnMapper } from '../mappers/return.mapper';
import type { ReturnsApi } from '../api/returns.api';

export const createReturnRepository = (returnsApi: ReturnsApi): IReturnRepository => ({
  listReturns: async (page, limit) => {
    const dto = await returnsApi.listReturns(page, limit);
    return ReturnMapper.toListEntity(dto);
  },

  getReturn: async (returnId) => {
    const dto = await returnsApi.getReturn(returnId);
    return ReturnMapper.toEntity(dto);
  },

  createReturn: async (request: CreateReturnRequest) => {
    const dto = await returnsApi.createReturn(request);
    return ReturnMapper.toEntity(dto);
  },
});
