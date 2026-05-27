import { useQuery, useMutation } from '@tanstack/react-query';
import type {
  CreateBuyerProfileRequest,
  UpdateBuyerProfileRequest,
} from '../../domain/entities/buyer.entity';
import { axiosInstance } from '@/core/network/axios.instance';
import { createBuyerProfilesApi } from '../../data/api/buyer.api';
import { createBuyerProfileRepository } from '../../data/repositories/buyer.repository.impl';
import {
  createCreateBuyerProfileUseCase,
  createGetMyBuyerProfileUseCase,
  createUpdateBuyerProfileUseCase,
} from '../../domain/use-cases/buyer.use-case';

const buyerProfilesApi = createBuyerProfilesApi(axiosInstance);
const buyerProfileRepository = createBuyerProfileRepository(buyerProfilesApi);

export const useCreateBuyerProfile = () => {
  const useCase = createCreateBuyerProfileUseCase(buyerProfileRepository);
  return useMutation({
    mutationFn: (request: CreateBuyerProfileRequest) => useCase.execute(request),
  });
};

export const useMyBuyerProfile = () => {
  const useCase = createGetMyBuyerProfileUseCase(buyerProfileRepository);
  return useQuery({
    queryKey: ['buyer_profile', 'me'],
    queryFn: () => useCase.execute(),
  });
};

export const useUpdateBuyerProfile = () => {
  const useCase = createUpdateBuyerProfileUseCase(buyerProfileRepository);
  return useMutation({
    mutationFn: (request: UpdateBuyerProfileRequest) => useCase.execute(request),
  });
};
