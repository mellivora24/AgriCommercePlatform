import type { AxiosInstance } from 'axios';
import type {
  SellerProfile,
  SellerWallet,
  SellerBankAccount,
  CreateSellerProfileRequest,
  UpdateSellerProfileRequest,
  CreateBankAccountRequest,
  UpdateBankAccountRequest,
} from '../../domain/entities/seller.entity';

export const createSellersApi = (axiosInstance: AxiosInstance) => ({
  createProfile: async (request: CreateSellerProfileRequest) => {
    const { data } = await axiosInstance.post('/sellers/profile', request);
    return data as SellerProfile;
  },

  getProfile: async (sellerId: number) => {
    const { data } = await axiosInstance.get(`/sellers/${sellerId}`);
    return data as SellerProfile;
  },

  updateProfile: async (sellerId: number, request: UpdateSellerProfileRequest) => {
    const { data } = await axiosInstance.put(`/sellers/${sellerId}`, request);
    return data as SellerProfile;
  },

  getBankAccounts: async (sellerId: number) => {
    const { data } = await axiosInstance.get(`/sellers/${sellerId}/bank-accounts`);
    return data as SellerBankAccount[];
  },

  createBankAccount: async (sellerId: number, request: CreateBankAccountRequest) => {
    const { data } = await axiosInstance.post(`/sellers/${sellerId}/bank-accounts`, request);
    return data as SellerBankAccount;
  },

  updateBankAccount: async (sellerId: number, accountId: number, request: UpdateBankAccountRequest) => {
    const { data } = await axiosInstance.put(`/sellers/${sellerId}/bank-accounts/${accountId}`, request);
    return data as SellerBankAccount;
  },

  deleteBankAccount: async (sellerId: number, accountId: number) => {
    await axiosInstance.delete(`/sellers/${sellerId}/bank-accounts/${accountId}`);
  },

  getWallet: async (sellerId: number) => {
    const { data } = await axiosInstance.get(`/sellers/${sellerId}/wallet`);
    return data as SellerWallet;
  },
});

export type SellersApi = ReturnType<typeof createSellersApi>;
