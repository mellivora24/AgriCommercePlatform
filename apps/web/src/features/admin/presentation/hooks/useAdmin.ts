import { useQuery, useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/core/network/axios.instance';
import { createAdminApi } from '../../data/api/admin.api';
import { createAdminRepository } from '../../data/repositories/admin.repository.impl';
import {
  createGetUsersUseCase,
  createGetSellersUseCase,
  createApproveSellerUseCase,
  createRejectSellerUseCase,
  createGetPlatformStatsUseCase,
  createGetSellerStatsUseCase,
} from '../../domain/use-cases/admin.use-case';

const adminApi = createAdminApi(axiosInstance);
const adminRepository = createAdminRepository(adminApi);

export const useAdminUsers = (page: number = 1, limit: number = 10, role?: string, status?: string) => {
  const useCase = createGetUsersUseCase(adminRepository);
  return useQuery({
    queryKey: ['admin', 'users', page, limit, role, status],
    queryFn: () => useCase.execute(page, limit, role, status),
  });
};

export const useAdminSellers = (page: number = 1, limit: number = 10, status?: string) => {
  const useCase = createGetSellersUseCase(adminRepository);
  return useQuery({
    queryKey: ['admin', 'sellers', page, limit, status],
    queryFn: () => useCase.execute(page, limit, status),
  });
};

export const useApproveSeller = () => {
  const useCase = createApproveSellerUseCase(adminRepository);
  return useMutation({
    mutationFn: (sellerId: number) => useCase.execute(sellerId),
  });
};

export const useRejectSeller = () => {
  const useCase = createRejectSellerUseCase(adminRepository);
  return useMutation({
    mutationFn: (sellerId: number) => useCase.execute(sellerId),
  });
};

export const useAdminPlatformStats = () => {
  const useCase = createGetPlatformStatsUseCase(adminRepository);
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => useCase.execute(),
  });
};

export const useAdminSellerStats = (sellerId: number) => {
  const useCase = createGetSellerStatsUseCase(adminRepository);
  return useQuery({
    queryKey: ['admin', 'seller', 'stats', sellerId],
    queryFn: () => useCase.execute(sellerId),
    enabled: !!sellerId,
  });
};
