import type { CreateReturnRequest, Return, ReturnListResponse } from '../entities/return.entity';

export interface IReturnRepository {
  listReturns(page: number, limit: number): Promise<ReturnListResponse>;
  getReturn(returnId: string): Promise<Return>;
  createReturn(request: CreateReturnRequest): Promise<Return>;
}
