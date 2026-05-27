import type { AxiosInstance } from 'axios';
import type { UserListResponse, SellerListResponse, PlatformStats, SellerStats } from '../../domain/entities/admin.entity';

export const createAdminApi = (axiosInstance: AxiosInstance) => ({
  getUsers: async (page: number, limit: number, role?: string, status?: string) => {
    const { data } = await axiosInstance.get('/admin/users', {
      params: { page, limit, role, status },
    });
    return data as UserListResponse;
  },

  getSellers: async (page: number, limit: number, status?: string) => {
    const { data } = await axiosInstance.get('/admin/sellers', {
      params: { page, limit, status },
    });
    return data as SellerListResponse;
  },

  approveSeller: async (sellerId: number) => {
    const { data } = await axiosInstance.post(`/admin/sellers/${sellerId}/approve`);
    return data;
  },

  rejectSeller: async (sellerId: number) => {
    const { data } = await axiosInstance.post(`/admin/sellers/${sellerId}/reject`);
    return data;
  },

  suspendUser: async (userId: number) => {
    const { data } = await axiosInstance.post(`/admin/users/${userId}/suspend`);
    return data;
  },

  banUser: async (userId: number) => {
    const { data } = await axiosInstance.post(`/admin/users/${userId}/ban`);
    return data;
  },

  getPlatformStats: async () => {
    const { data } = await axiosInstance.get('/admin/stats');
    return data as PlatformStats;
  },

  getSellerStats: async (sellerId: number) => {
    const { data } = await axiosInstance.get(`/admin/sellers/${sellerId}/stats`);
    return data as SellerStats;
  },
});

export type AdminApi = ReturnType<typeof createAdminApi>;
