import type { UserListResponse, SellerListResponse, PlatformStats, SellerStats } from '../entities/admin.entity';

export interface IAdminRepository {
  getUsers(page: number, limit: number, role?: string, status?: string): Promise<UserListResponse>;
  getSellers(page: number, limit: number, status?: string): Promise<SellerListResponse>;
  approveSeller(sellerId: number): Promise<void>;
  rejectSeller(sellerId: number): Promise<void>;
  suspendUser(userId: number): Promise<void>;
  banUser(userId: number): Promise<void>;
  getPlatformStats(): Promise<PlatformStats>;
  getSellerStats(sellerId: number): Promise<SellerStats>;
}
