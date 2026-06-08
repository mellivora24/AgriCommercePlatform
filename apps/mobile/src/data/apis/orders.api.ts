import { axiosInstance } from '@/core/axios/axiosInstance';
import type {
  OrderDto,
  OrderListResponseDto,
  OrderStatsDto,
  CreateOrderRequestDto,
} from '../dtos/order.dto';

export interface GetSellerOrdersQuery {
  status?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}

export const ordersApi = {
  createOrder: async (data: CreateOrderRequestDto): Promise<OrderDto[]> => {
    const response = await axiosInstance.post<OrderDto[]>('/orders', data);
    return response.data;
  },

  getOrder: async (orderId: number): Promise<OrderDto> => {
    const response = await axiosInstance.get<OrderDto>(`/orders/${orderId}`);
    return response.data;
  },

  listBuyerOrders: async (): Promise<OrderDto[]> => {
    const response = await axiosInstance.get<OrderDto[]>('/orders');
    return response.data;
  },

  listSellerOrders: async (params: GetSellerOrdersQuery): Promise<OrderListResponseDto> => {
    const response = await axiosInstance.get<OrderListResponseDto>('/orders/seller/me', { params });
    return response.data;
  },

  getSellerOrderStats: async (): Promise<OrderStatsDto> => {
    const response = await axiosInstance.get<OrderStatsDto>('/orders/seller/stats');
    return response.data;
  },

  updateOrderStatus: async (orderId: number, status: string): Promise<OrderDto> => {
    const response = await axiosInstance.put<OrderDto>(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  confirmOrder: async (orderId: number): Promise<OrderDto> => {
    const response = await axiosInstance.post<OrderDto>(`/orders/${orderId}/confirm`);
    return response.data;
  },

  cancelOrder: async (orderId: number): Promise<OrderDto> => {
    const response = await axiosInstance.post<OrderDto>(`/orders/${orderId}/cancel`);
    return response.data;
  },
};
