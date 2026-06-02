import { axiosInstance } from '@/core/network/axios.instance';
import type {
  GetSellerOrdersQueryDto,
  GetSellerProductsQueryDto,
  SellerDashboardResponseDto,
  SellerOrdersResponseDto,
  SellerProductsResponseDto,
  SellerSettingsResponseDto,
  UpdateSellerSettingsDto,
  SellerWithdrawDto,
  SellerWithdrawResponseDto,
  CreateSellerBankAccountDto,
  UpdateSellerBankAccountDto,
  SellerBankAccountResponseDto,
} from '@/features/sellers/data/dtos/seller.dto';

const BASE = '/sellers';

export const sellerApi = {
  getDashboard(): Promise<SellerDashboardResponseDto> {
    return axiosInstance.get(`${BASE}/dashboard`).then((res) => res.data);
  },

  getProducts(query: GetSellerProductsQueryDto = {}): Promise<SellerProductsResponseDto> {
    return axiosInstance.get(`${BASE}/products`, { params: query }).then((res) => res.data);
  },

  getOrders(query: GetSellerOrdersQueryDto = {}): Promise<SellerOrdersResponseDto> {
    return axiosInstance.get(`${BASE}/orders`, { params: query }).then((res) => res.data);
  },

  getSettings(): Promise<SellerSettingsResponseDto> {
    return axiosInstance.get(`${BASE}/settings`).then((res) => res.data);
  },

  updateSettings(dto: UpdateSellerSettingsDto): Promise<SellerSettingsResponseDto> {
    return axiosInstance.patch(`${BASE}/settings`, dto).then((res) => res.data);
  },

  withdraw(dto: SellerWithdrawDto): Promise<SellerWithdrawResponseDto> {
    return axiosInstance.post(`${BASE}/withdraw`, dto).then((res) => res.data);
  },

  addBankAccount(dto: CreateSellerBankAccountDto): Promise<SellerBankAccountResponseDto> {
    return axiosInstance.post(`${BASE}/bank-accounts`, dto).then((res) => res.data);
  },

  updateBankAccount(bankAccountId: number, dto: UpdateSellerBankAccountDto): Promise<SellerBankAccountResponseDto> {
    return axiosInstance.patch(`${BASE}/bank-accounts/${bankAccountId}`, dto).then((res) => res.data);
  },

  deleteBankAccount(bankAccountId: number): Promise<{ message: string }> {
    return axiosInstance.delete(`${BASE}/bank-accounts/${bankAccountId}`).then((res) => res.data);
  },
};
