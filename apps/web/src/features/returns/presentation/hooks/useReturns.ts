import { useQuery, useMutation } from '@tanstack/react-query';
import type { CreateReturnRequest } from '../../domain/entities/return.entity';
import { axiosInstance } from '@/core/network/axios.instance';
import { createReturnsApi } from '../../data/api/returns.api';
import { createReturnRepository } from '../../data/repositories/return.repository.impl';
import {
  createListReturnsUseCase,
  createGetReturnUseCase,
  createCreateReturnUseCase,
} from '../../domain/use-cases/return.use-case';
import { QUERY_KEYS } from '@/core/constants/query-keys';

const returnsApi = createReturnsApi(axiosInstance);
const returnRepository = createReturnRepository(returnsApi);

export const useListReturns = (page: number = 1, limit: number = 10) => {
  const useCase = createListReturnsUseCase(returnRepository);
  return useQuery({
    queryKey: QUERY_KEYS.RETURNS_LIST(page),
    queryFn: () => useCase.execute(page, limit),
  });
};

export const useGetReturn = (returnId: string) => {
  const useCase = createGetReturnUseCase(returnRepository);
  return useQuery({
    queryKey: QUERY_KEYS.RETURNS_LIST(1), // Use generic key
    queryFn: () => useCase.execute(returnId),
    enabled: !!returnId,
  });
};

export const useCreateReturn = () => {
  const useCase = createCreateReturnUseCase(returnRepository);
  return useMutation({
    mutationFn: (request: CreateReturnRequest) => useCase.execute(request),
  });
};
