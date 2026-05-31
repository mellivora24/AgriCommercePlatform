import type { CreateReturnRequest, Return, ReturnListResponse } from '../entities/return.entity';
import type { IReturnRepository } from '../repositories/return.repository';

export interface ListReturnsUseCase {
  execute(page: number, limit: number): Promise<ReturnListResponse>;
}

export interface GetReturnUseCase {
  execute(returnId: string): Promise<Return>;
}

export interface CreateReturnUseCase {
  execute(request: CreateReturnRequest): Promise<Return>;
}

export const createListReturnsUseCase = (repository: IReturnRepository): ListReturnsUseCase => ({
  execute: (page, limit) => repository.listReturns(page, limit),
});

export const createGetReturnUseCase = (repository: IReturnRepository): GetReturnUseCase => ({
  execute: (returnId) => repository.getReturn(returnId),
});

export const createCreateReturnUseCase = (repository: IReturnRepository): CreateReturnUseCase => ({
  execute: (request) => repository.createReturn(request),
});
