import { axiosInstance } from '@/core/network/axios.instance';
import type {
  GetSellerOrdersQueryDto,
  GetSellerProductsQueryDto,
  SellerDashboardResponseDto,
  SellerOrdersResponseDto,
  SellerProductsResponseDto,
  SellerSettingsResponseDto,
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
};
