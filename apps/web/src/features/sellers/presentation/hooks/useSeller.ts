import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/core/constants/query-keys';
import {
  GetSellerDashboardUseCase,
  GetSellerOrdersUseCase,
  GetSellerProductsUseCase,
  GetSellerSettingsUseCase,
} from '@/features/sellers/domain/use-cases/seller.use-case';
import { SellerRepositoryImpl } from '@/features/sellers/data/repositories/seller.repository.impl';
import type { SellerOrdersFilter, SellerProductsFilter } from '@/features/sellers/domain/entities/seller.entity';

const repository = new SellerRepositoryImpl();

const getOrdersUseCase = GetSellerOrdersUseCase(repository);
const getProductsUseCase = GetSellerProductsUseCase(repository);
const getSettingsUseCase = GetSellerSettingsUseCase(repository);
const getDashboardUseCase = GetSellerDashboardUseCase(repository);

export function useSellerDashboard() {
  return useQuery({
    queryKey: [QUERY_KEYS.SELLER_DASHBOARD],
    queryFn: () => getDashboardUseCase.execute(),
  });
}

export function useSellerProducts(filter: SellerProductsFilter = {}) {
  return useQuery({
    queryKey: [QUERY_KEYS.SELLER_PRODUCTS, filter],
    queryFn: () => getProductsUseCase.execute(filter),
  });
}

export function useSellerOrders(filter: SellerOrdersFilter = {}) {
  return useQuery({
    queryKey: [QUERY_KEYS.SELLER_ORDERS, filter],
    queryFn: () => getOrdersUseCase.execute(filter),
  });
}

export function useSellerSettings() {
  return useQuery({
    queryKey: [QUERY_KEYS.SELLER_SETTINGS],
    queryFn: () => getSettingsUseCase.execute(),
  });
}
