import { adminApi } from "@/features/admin/data/api/admin.api";
import { adminMapper } from "@/features/admin/data/mappers/admin.mapper";
import type { IAdminRepository } from "@/features/admin/domain/repositories/admin.repository";
import type {
  DashboardStats,
  AdminUser,
  Store,
  StoreDetail,
  AdminProduct,
  OrderSummary,
  WithdrawalRequest,
  Paginated,
  ShipperStat,
} from "@/features/admin/domain/entities/admin.entity";
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
} from "@/features/admin/data/dtos/admin.dto";

export class AdminRepositoryImpl implements IAdminRepository {
  async getDashboard(): Promise<DashboardStats> {
    const dto = await adminApi.getDashboard();
    return adminMapper.toDashboard(dto);
  }

  async getStores(query?: AdminStoreListQuery): Promise<Paginated<Store>> {
    const res = await adminApi.getStores(query);
    return { data: res.data.map(adminMapper.toStore), meta: res.meta };
  }

  async getStoreDetail(sellerId: number): Promise<StoreDetail> {
    const dto = await adminApi.getStoreDetail(sellerId);
    return adminMapper.toStoreDetail(dto);
  }

  async getStoreProducts(
    sellerId: number,
    query?: AdminStoreProductQuery,
  ): Promise<Paginated<AdminProduct>> {
    const res = await adminApi.getStoreProducts(sellerId, query);
    return { data: res.data.map(adminMapper.toProduct), meta: res.meta };
  }

  async getStoreOrders(
    sellerId: number,
    query?: AdminStoreOrderQuery,
  ): Promise<Paginated<OrderSummary>> {
    const res = await adminApi.getStoreOrders(sellerId, query);
    return { data: res.data.map(adminMapper.toOrderSummary), meta: res.meta };
  }

  async getStoreWithdrawals(
    sellerId: number,
    query?: AdminStoreWithdrawalQuery,
  ): Promise<Paginated<WithdrawalRequest>> {
    const res = await adminApi.getStoreWithdrawals(sellerId, query);
    return { data: res.data.map(adminMapper.toWithdrawal), meta: res.meta };
  }

  async approveSeller(sellerId: number): Promise<void> {
    await adminApi.approveSeller(sellerId);
  }

  async rejectSeller(sellerId: number, body: RejectSellerDTO): Promise<void> {
    await adminApi.rejectSeller(sellerId, body);
  }

  async suspendSeller(sellerId: number): Promise<void> {
    await adminApi.suspendSeller(sellerId);
  }

  async updateStoreFee(
    sellerId: number,
    body: UpdateStoreFeeDTO,
  ): Promise<StoreDetail> {
    const dto = await adminApi.updateStoreFee(sellerId, body);
    return adminMapper.toStoreDetail(dto);
  }

  async getProducts(
    query?: AdminProductListQuery,
  ): Promise<Paginated<AdminProduct>> {
    const res = await adminApi.getProducts(query);
    return { data: res.data.map(adminMapper.toProduct), meta: res.meta };
  }

  async getProductDetail(productId: number): Promise<AdminProduct> {
    const dto = await adminApi.getProductDetail(productId);
    return adminMapper.toProduct(dto);
  }

  async deleteProduct(productId: number): Promise<void> {
    await adminApi.deleteProduct(productId);
  }

  async getUsers(query?: AdminUserListQuery): Promise<Paginated<AdminUser>> {
    const res = await adminApi.getUsers(query);
    return { data: res.data.map(adminMapper.toUser), meta: res.meta };
  }

  async getUserDetail(userId: number): Promise<AdminUser> {
    const dto = await adminApi.getUserDetail(userId);
    return adminMapper.toUserDetail(dto);
  }

  async suspendUser(userId: number, body: SuspendUserDTO): Promise<void> {
    await adminApi.suspendUser(userId, body);
  }

  async banUser(userId: number, body: BanUserDTO): Promise<void> {
    await adminApi.banUser(userId, body);
  }

  async deleteUser(userId: number): Promise<void> {
    await adminApi.deleteUser(userId);
  }

  async approveWithdrawal(withdrawalId: number): Promise<void> {
    await adminApi.approveWithdrawal(withdrawalId);
  }

  async rejectWithdrawal(
    withdrawalId: number,
    body: RejectWithdrawalDTO,
  ): Promise<void> {
    await adminApi.rejectWithdrawal(withdrawalId, body);
  }

  async createAdmin(userId: number, body: CreateAdminDTO): Promise<void> {
    await adminApi.createAdmin(userId, body);
  }
  async getShipperLeaderboard(
    query?: AdminShipperLeaderboardQuery,
  ): Promise<Paginated<ShipperStat>> {
    const res = await adminApi.getShipperLeaderboard(query);
    return {
      data: res.items.map(adminMapper.toShipperStat),
      meta: res.meta,
    };
  }
}
