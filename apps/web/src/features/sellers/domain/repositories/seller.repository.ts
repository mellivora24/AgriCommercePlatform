import type {
  SellerDashboard,
  SellerOrderList,
  SellerOrdersFilter,
  SellerProductList,
  SellerProductsFilter,
  SellerSettings,
} from '../entities/seller.entity';

export interface ISellerRepository {
  getDashboard(): Promise<SellerDashboard>;
  getProducts(filter: SellerProductsFilter): Promise<SellerProductList>;
  getOrders(filter: SellerOrdersFilter): Promise<SellerOrderList>;
  getSettings(): Promise<SellerSettings>;
}
