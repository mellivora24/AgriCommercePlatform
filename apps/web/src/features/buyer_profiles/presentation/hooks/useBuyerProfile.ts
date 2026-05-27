import { useQuery, useMutation } from '@tanstack/react-query';
import type {
  CreateBuyerProfileRequest,
  UpdateBuyerProfileRequest,
} from '../../domain/entities/buyer_profile.entity';
import { axiosInstance } from '@/core/network/axios.instance';
import { createBuyerProfilesApi } from '../../data/api/buyer_profile.api';
import { createBuyerProfileRepository } from '../../data/repositories/buyer_profile.repository.impl';
import {
  createCreateBuyerProfileUseCase,
  createGetMyBuyerProfileUseCase,
  createUpdateBuyerProfileUseCase,
} from '../../domain/use-cases/buyer_profile.use-case';

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
