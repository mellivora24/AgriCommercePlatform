import type { IAdminRepository } from '@/features/admin/domain/repositories/admin.repository';
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
  AdminShipperLeaderboardQuery,
} from '@/features/admin/data/dtos/admin.dto';

export const createAdminUseCases = (repo: IAdminRepository) => ({
  getDashboard: () => repo.getDashboard(),

  getStores: (query?: AdminStoreListQuery) => repo.getStores(query),
  getStoreDetail: (sellerId: number) => repo.getStoreDetail(sellerId),
  getStoreProducts: (sellerId: number, query?: AdminStoreProductQuery) => repo.getStoreProducts(sellerId, query),
  getStoreOrders: (sellerId: number, query?: AdminStoreOrderQuery) => repo.getStoreOrders(sellerId, query),
  getStoreWithdrawals: (sellerId: number, query?: AdminStoreWithdrawalQuery) => repo.getStoreWithdrawals(sellerId, query),
  approveSeller: (sellerId: number) => repo.approveSeller(sellerId),
  rejectSeller: (sellerId: number, body: RejectSellerDTO) => repo.rejectSeller(sellerId, body),
  suspendSeller: (sellerId: number) => repo.suspendSeller(sellerId),
  updateStoreFee: (sellerId: number, body: UpdateStoreFeeDTO) => repo.updateStoreFee(sellerId, body),

  getProducts: (query?: AdminProductListQuery) => repo.getProducts(query),
  getProductDetail: (productId: number) => repo.getProductDetail(productId),
  deleteProduct: (productId: number) => repo.deleteProduct(productId),

  getUsers: (query?: AdminUserListQuery) => repo.getUsers(query),
  getUserDetail: (userId: number) => repo.getUserDetail(userId),
  suspendUser: (userId: number, body: SuspendUserDTO) => repo.suspendUser(userId, body),
  banUser: (userId: number, body: BanUserDTO) => repo.banUser(userId, body),
  deleteUser: (userId: number) => repo.deleteUser(userId),

  approveWithdrawal: (withdrawalId: number) => repo.approveWithdrawal(withdrawalId),
  rejectWithdrawal: (withdrawalId: number, body: RejectWithdrawalDTO) => repo.rejectWithdrawal(withdrawalId, body),

  createAdmin: (userId: number, body: CreateAdminDTO) => repo.createAdmin(userId, body),
  getShipperLeaderboard: (query?: AdminShipperLeaderboardQuery) =>
  repo.getShipperLeaderboard(query),
});

export type AdminUseCases = ReturnType<typeof createAdminUseCases>;
