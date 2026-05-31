import type {
  SellerDashboard,
  SellerOrderList,
  SellerOrdersFilter,
  SellerProductList,
  SellerProductsFilter,
  SellerSettings,
} from '@/features/sellers/domain/entities/seller.entity';
import type { ISellerRepository } from '@/features/sellers/domain/repositories/seller.repository';

export const GetSellerDashboardUseCase = (repository: ISellerRepository) => {
  return {
    execute(): Promise<SellerDashboard> {
      return repository.getDashboard();
    }
  };
};

export const GetSellerProductsUseCase = (repository: ISellerRepository) => {
  return {
    execute(filter: SellerProductsFilter): Promise<SellerProductList> {
      return repository.getProducts(filter);
    }
  };
};

export const GetSellerOrdersUseCase = (repository: ISellerRepository) => {
  return {
    execute(filter: SellerOrdersFilter): Promise<SellerOrderList> {
      return repository.getOrders(filter);
    }
  };
};

export const GetSellerSettingsUseCase = (repository: ISellerRepository) => {
  return {
    execute(): Promise<SellerSettings> {
      return repository.getSettings();
    }
  };
};

