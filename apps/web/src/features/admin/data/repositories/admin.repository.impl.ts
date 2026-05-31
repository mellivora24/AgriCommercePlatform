import type { IAdminRepository } from '../../domain/repositories/admin.repository';
import type { AdminApi } from '../api/admin.api';

export const createAdminRepository = (adminApi: AdminApi): IAdminRepository => ({
  getUsers: (page, limit, role, status) => adminApi.getUsers(page, limit, role, status),
  getSellers: (page, limit, status) => adminApi.getSellers(page, limit, status),
  approveSeller: (sellerId) => adminApi.approveSeller(sellerId),
  rejectSeller: (sellerId) => adminApi.rejectSeller(sellerId),
  suspendUser: (userId) => adminApi.suspendUser(userId),
  banUser: (userId) => adminApi.banUser(userId),
  getPlatformStats: () => adminApi.getPlatformStats(),
  getSellerStats: (sellerId) => adminApi.getSellerStats(sellerId),
});
