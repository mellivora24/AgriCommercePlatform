import { axiosInstance } from "@/core/network";
import type {
  AdminDashboardDTO,
  AdminUserDTO,
  AdminUserDetailDTO,
  AdminStoreDTO,
  AdminStoreDetailDTO,
  AdminProductDTO,
  AdminOrderSummaryDTO,
  AdminWithdrawalDTO,
  AdminUserListQuery,
  AdminStoreListQuery,
  AdminStoreProductQuery,
  AdminStoreOrderQuery,
  AdminStoreWithdrawalQuery,
  AdminProductListQuery,
  PaginatedResponse,
  RejectSellerDTO,
  RejectWithdrawalDTO,
  UpdateStoreFeeDTO,
  SuspendUserDTO,
  BanUserDTO,
  CreateAdminDTO,
  PaginationMeta,
  AdminShipperStatDTO,
} from "@/features/admin/data/dtos/admin.dto";

export const adminApi = {
  getDashboard: async (): Promise<AdminDashboardDTO> => {
    const res = await axiosInstance.get<AdminDashboardDTO>("/admin/dashboard");
    return res.data;
  },

  getStores: async (
    query?: AdminStoreListQuery,
  ): Promise<PaginatedResponse<AdminStoreDTO>> => {
    const res = await axiosInstance.get<PaginatedResponse<AdminStoreDTO>>(
      "/admin/stores",
      { params: query },
    );
    return res.data;
  },

  getStoreDetail: async (sellerId: number): Promise<AdminStoreDetailDTO> => {
    const res = await axiosInstance.get<AdminStoreDetailDTO>(
      `/admin/stores/${sellerId}`,
    );
    return res.data;
  },

  getStoreProducts: async (
    sellerId: number,
    query?: AdminStoreProductQuery,
  ): Promise<PaginatedResponse<AdminProductDTO>> => {
    const res = await axiosInstance.get<PaginatedResponse<AdminProductDTO>>(
      `/admin/stores/${sellerId}/products`,
      { params: query },
    );
    return res.data;
  },

  getStoreOrders: async (
    sellerId: number,
    query?: AdminStoreOrderQuery,
  ): Promise<PaginatedResponse<AdminOrderSummaryDTO>> => {
    const res = await axiosInstance.get<
      PaginatedResponse<AdminOrderSummaryDTO>
    >(`/admin/stores/${sellerId}/orders`, { params: query });
    return res.data;
  },

  getStoreWithdrawals: async (
    sellerId: number,
    query?: AdminStoreWithdrawalQuery,
  ): Promise<PaginatedResponse<AdminWithdrawalDTO>> => {
    const res = await axiosInstance.get<PaginatedResponse<AdminWithdrawalDTO>>(
      `/admin/stores/${sellerId}/withdrawals`,
      { params: query },
    );
    return res.data;
  },

  approveSeller: async (sellerId: number): Promise<void> => {
    await axiosInstance.post(`/admin/stores/${sellerId}/approve`);
  },

  rejectSeller: async (
    sellerId: number,
    body: RejectSellerDTO,
  ): Promise<void> => {
    await axiosInstance.post(`/admin/stores/${sellerId}/reject`, body);
  },

  suspendSeller: async (sellerId: number): Promise<void> => {
    await axiosInstance.post(`/admin/stores/${sellerId}/suspend`);
  },

  updateStoreFee: async (
    sellerId: number,
    body: UpdateStoreFeeDTO,
  ): Promise<AdminStoreDetailDTO> => {
    const res = await axiosInstance.patch<AdminStoreDetailDTO>(
      `/admin/stores/${sellerId}/fee`,
      body,
    );
    return res.data;
  },

  getProducts: async (
    query?: AdminProductListQuery,
  ): Promise<PaginatedResponse<AdminProductDTO>> => {
    const res = await axiosInstance.get<PaginatedResponse<AdminProductDTO>>(
      "/admin/products",
      { params: query },
    );
    return res.data;
  },

  getProductDetail: async (productId: number): Promise<AdminProductDTO> => {
    const res = await axiosInstance.get<AdminProductDTO>(
      `/admin/products/${productId}`,
    );
    return res.data;
  },

  deleteProduct: async (productId: number): Promise<void> => {
    await axiosInstance.delete(`/admin/products/${productId}`);
  },

  getUsers: async (
    query?: AdminUserListQuery,
  ): Promise<PaginatedResponse<AdminUserDTO>> => {
    const res = await axiosInstance.get<PaginatedResponse<AdminUserDTO>>(
      "/admin/users",
      { params: query },
    );
    return res.data;
  },

  getUserDetail: async (userId: number): Promise<AdminUserDetailDTO> => {
    const res = await axiosInstance.get<AdminUserDetailDTO>(
      `/admin/users/${userId}`,
    );
    return res.data;
  },

  suspendUser: async (userId: number, body: SuspendUserDTO): Promise<void> => {
    await axiosInstance.post(`/admin/users/${userId}/suspend`, body);
  },

  banUser: async (userId: number, body: BanUserDTO): Promise<void> => {
    await axiosInstance.post(`/admin/users/${userId}/ban`, body);
  },

  deleteUser: async (userId: number): Promise<void> => {
    await axiosInstance.delete(`/admin/users/${userId}`);
  },

  approveWithdrawal: async (withdrawalId: number): Promise<void> => {
    await axiosInstance.post(`/admin/withdrawals/${withdrawalId}/approve`);
  },

  rejectWithdrawal: async (
    withdrawalId: number,
    body: RejectWithdrawalDTO,
  ): Promise<void> => {
    await axiosInstance.post(`/admin/withdrawals/${withdrawalId}/reject`, body);
  },

  createAdmin: async (userId: number, body: CreateAdminDTO): Promise<void> => {
    await axiosInstance.post(`/admin/users/${userId}/make-admin`, body);
  },
  getShipperLeaderboard: async (query?: {
    page?: number;
    limit?: number;
  }): Promise<{
    items: AdminShipperStatDTO[];
    meta: PaginationMeta;
  }> => {
    const res = await axiosInstance.get(
      "/delivery/admin/shippers/leaderboard",
      {
        params: query,
      },
    );
    return res.data;
  },
};
