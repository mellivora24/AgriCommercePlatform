import type {
  DashboardStats,
  AdminUser,
  Store,
  StoreDetail,
  AdminProduct,
  OrderSummary,
  WithdrawalRequest,
  Paginated,
} from '@/features/admin/domain/entities/admin.entity';
import type {
  AdminUserListQuery,
  AdminStoreListQuery,
  AdminStoreProductQuery,
  AdminStoreOrderQuery,
  AdminStoreWithdrawalQuery,
  AdminProductListQuery,
  RejectSellerDTO,
  RejectWithdrawalDTO,
  UpdateStoreFeeDTO,
  SuspendUserDTO,
  BanUserDTO,
  CreateAdminDTO,
} from '@/features/admin/data/dtos/admin.dto';

export interface IAdminRepository {
  getDashboard(): Promise<DashboardStats>;

  getStores(query?: AdminStoreListQuery): Promise<Paginated<Store>>;
  getStoreDetail(sellerId: number): Promise<StoreDetail>;
  getStoreProducts(sellerId: number, query?: AdminStoreProductQuery): Promise<Paginated<AdminProduct>>;
  getStoreOrders(sellerId: number, query?: AdminStoreOrderQuery): Promise<Paginated<OrderSummary>>;
  getStoreWithdrawals(sellerId: number, query?: AdminStoreWithdrawalQuery): Promise<Paginated<WithdrawalRequest>>;
  approveSeller(sellerId: number): Promise<void>;
  rejectSeller(sellerId: number, body: RejectSellerDTO): Promise<void>;
  suspendSeller(sellerId: number): Promise<void>;
  updateStoreFee(sellerId: number, body: UpdateStoreFeeDTO): Promise<StoreDetail>;

  getProducts(query?: AdminProductListQuery): Promise<Paginated<AdminProduct>>;
  getProductDetail(productId: number): Promise<AdminProduct>;
  deleteProduct(productId: number): Promise<void>;

  getUsers(query?: AdminUserListQuery): Promise<Paginated<AdminUser>>;
  getUserDetail(userId: number): Promise<AdminUser>;
  suspendUser(userId: number, body: SuspendUserDTO): Promise<void>;
  banUser(userId: number, body: BanUserDTO): Promise<void>;
  deleteUser(userId: number): Promise<void>;

  approveWithdrawal(withdrawalId: number): Promise<void>;
  rejectWithdrawal(withdrawalId: number, body: RejectWithdrawalDTO): Promise<void>;

  createAdmin(userId: number, body: CreateAdminDTO): Promise<void>;
}
