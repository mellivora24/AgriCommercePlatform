import { useQuery, useMutation } from '@tanstack/react-query';
import type {
  CreateSellerProfileRequest,
  UpdateSellerProfileRequest,
  CreateBankAccountRequest,
} from '../../domain/entities/seller.entity';
import { axiosInstance } from '@/core/network/axios.instance';
import { createSellersApi } from '../../data/api/seller.api';
import { createSellerRepository } from '../../data/repositories/seller.repository.impl';
import {
  createCreateSellerProfileUseCase,
  createGetSellerProfileUseCase,
  createUpdateSellerProfileUseCase,
  createGetBankAccountsUseCase,
  createCreateBankAccountUseCase,
  createGetSellerWalletUseCase,
} from '../../domain/use-cases/seller.use-case';

const sellersApi = createSellersApi(axiosInstance);
const sellerRepository = createSellerRepository(sellersApi);

export const useCreateSellerProfile = () => {
  const useCase = createCreateSellerProfileUseCase(sellerRepository);
  return useMutation({
    mutationFn: (request: CreateSellerProfileRequest) => useCase.execute(request),
  });
};

export const useGetSellerProfile = (sellerId: number | null) => {
  const useCase = createGetSellerProfileUseCase(sellerRepository);
  return useQuery({
    queryKey: ['seller', 'profile', sellerId],
    queryFn: () => useCase.execute(sellerId!),
    enabled: !!sellerId,
  });
};

export const useUpdateSellerProfile = () => {
  const useCase = createUpdateSellerProfileUseCase(sellerRepository);
  return useMutation({
    mutationFn: ({ sellerId, request }: { sellerId: number; request: UpdateSellerProfileRequest }) =>
      useCase.execute(sellerId, request),
  });
};

export const useGetBankAccounts = (sellerId: number | null) => {
  const useCase = createGetBankAccountsUseCase(sellerRepository);
  return useQuery({
    queryKey: ['seller', 'bank-accounts', sellerId],
    queryFn: () => useCase.execute(sellerId!),
    enabled: !!sellerId,
  });
};

export const useCreateBankAccount = () => {
  const useCase = createCreateBankAccountUseCase(sellerRepository);
  return useMutation({
    mutationFn: ({ sellerId, request }: { sellerId: number; request: CreateBankAccountRequest }) =>
      useCase.execute(sellerId, request),
  });
};

export const useGetSellerWallet = (sellerId: number | null) => {
  const useCase = createGetSellerWalletUseCase(sellerRepository);
  return useQuery({
    queryKey: ['seller', 'wallet', sellerId],
    queryFn: () => useCase.execute(sellerId!),
    enabled: !!sellerId,
  });
};
