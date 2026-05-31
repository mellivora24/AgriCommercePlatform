import type {
  SellerDashboard,
  SellerOrderList,
  SellerOrdersFilter,
  SellerProductList,
  SellerProductsFilter,
  SellerSettings,
} from '@/features/sellers/domain/entities/seller.entity';
import type { ISellerRepository } from '@/features/sellers/domain/repositories/seller.repository';
import { sellerApi } from '@/features/sellers/data/api/seller.api';
import { mapDashboard, mapOrders, mapProducts, mapSettings } from '../mappers/seller.mapper';

export class SellerRepositoryImpl implements ISellerRepository {
  async getDashboard(): Promise<SellerDashboard> {
    const dto = await sellerApi.getDashboard();
    return mapDashboard(dto);
  }

  async getProducts(filter: SellerProductsFilter): Promise<SellerProductList> {
    const dto = await sellerApi.getProducts(filter);
    return mapProducts(dto);
  }

  async getOrders(filter: SellerOrdersFilter): Promise<SellerOrderList> {
    const dto = await sellerApi.getOrders(filter);
    return mapOrders(dto);
  }

  async getSettings(): Promise<SellerSettings> {
    const dto = await sellerApi.getSettings();
    return mapSettings(dto);
  }
}
