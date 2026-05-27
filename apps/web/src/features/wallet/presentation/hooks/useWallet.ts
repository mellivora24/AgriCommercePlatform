import { useQuery, useMutation } from '@tanstack/react-query';
import type { TopupRequest } from '../../domain/entities/wallet.entity';
import { axiosInstance } from '@/core/network/axios.instance';
import { createWalletApi } from '../../data/api/wallet.api';
import { createWalletRepository } from '../../data/repositories/wallet.repository.impl';
import {
  createGetBalanceUseCase,
  createGetTransactionsUseCase,
  createTopupUseCase,
} from '../../domain/use-cases/wallet.use-case';
import { QUERY_KEYS } from '@/core/constants/query-keys';

const walletApi = createWalletApi(axiosInstance);
const walletRepository = createWalletRepository(walletApi);

export const useWalletBalance = () => {
  const useCase = createGetBalanceUseCase(walletRepository);
  return useQuery({
    queryKey: QUERY_KEYS.WALLET_BALANCE,
    queryFn: () => useCase.execute(),
  });
};

export const useWalletTransactions = (page: number = 1, limit: number = 10) => {
  const useCase = createGetTransactionsUseCase(walletRepository);
  return useQuery({
    queryKey: QUERY_KEYS.WALLET_TRANSACTIONS(page),
    queryFn: () => useCase.execute(page, limit),
  });
};

export const useTopupWallet = () => {
  const useCase = createTopupUseCase(walletRepository);
  return useMutation({
    mutationFn: (request: TopupRequest) => useCase.execute(request),
  });
};
