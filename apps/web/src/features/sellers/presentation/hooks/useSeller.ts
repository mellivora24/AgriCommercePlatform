import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/core/constants/query-keys';
import {
  AddSellerBankAccountUseCase,
  DeleteSellerBankAccountUseCase,
  GetSellerDashboardUseCase,
  GetSellerOrdersUseCase,
  GetSellerProductsUseCase,
  GetSellerSettingsUseCase,
  SellerWithdrawUseCase,
  UpdateSellerBankAccountUseCase,
  UpdateSellerSettingsUseCase,
} from '@/features/sellers/domain/use-cases/seller.use-case';
import { SellerRepositoryImpl } from '@/features/sellers/data/repositories/seller.repository.impl';
import type {
  CreateBankAccountInput,
  SellerOrdersFilter,
  SellerProductsFilter,
  SellerWithdrawInput,
  UpdateBankAccountInput,
  UpdateSellerSettingsInput,
} from '@/features/sellers/domain/entities/seller.entity';

const repository = new SellerRepositoryImpl();

const getDashboardUseCase = GetSellerDashboardUseCase(repository);
const getProductsUseCase = GetSellerProductsUseCase(repository);
const getOrdersUseCase = GetSellerOrdersUseCase(repository);
const getSettingsUseCase = GetSellerSettingsUseCase(repository);
const updateSettingsUseCase = UpdateSellerSettingsUseCase(repository);
const withdrawUseCase = SellerWithdrawUseCase(repository);
const addBankAccountUseCase = AddSellerBankAccountUseCase(repository);
const updateBankAccountUseCase = UpdateSellerBankAccountUseCase(repository);
const deleteBankAccountUseCase = DeleteSellerBankAccountUseCase(repository);

export function useSellerDashboard() {
  return useQuery({
    queryKey: QUERY_KEYS.SELLER_DASHBOARD,
    queryFn: () => getDashboardUseCase.execute(),
  });
}

export function useSellerProducts(filter: SellerProductsFilter = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.SELLER_PRODUCTS(filter as Record<string, unknown>),
    queryFn: () => getProductsUseCase.execute(filter),
  });
}

export function useSellerOrders(filter: SellerOrdersFilter = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.SELLER_ORDERS(filter as Record<string, unknown>),
    queryFn: () => getOrdersUseCase.execute(filter),
  });
}

export function useSellerSettings() {
  return useQuery({
    queryKey: QUERY_KEYS.SELLER_SETTINGS,
    queryFn: () => getSettingsUseCase.execute(),
  });
}

export function useUpdateSellerSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateSellerSettingsInput) => updateSettingsUseCase.execute(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEYS.SELLER_SETTINGS, updated);
    },
  });
}

export function useSellerWithdraw() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SellerWithdrawInput) => withdrawUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SELLER_SETTINGS });
    },
  });
}

export function useAddSellerBankAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBankAccountInput) => addBankAccountUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SELLER_SETTINGS });
    },
  });
}

export function useUpdateSellerBankAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bankAccountId, data }: { bankAccountId: number; data: UpdateBankAccountInput }) =>
      updateBankAccountUseCase.execute(bankAccountId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SELLER_SETTINGS });
    },
  });
}

export function useDeleteSellerBankAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bankAccountId: number) => deleteBankAccountUseCase.execute(bankAccountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SELLER_SETTINGS });
    },
  });
}
