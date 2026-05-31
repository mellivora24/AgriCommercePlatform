import type { AxiosInstance } from 'axios';
import type {
  CreateOrderRequestDTO,
  CreateOrderResponseDTO,
  OrderDTO,
  OrderListResponseDTO,
  UpdateOrderStatusRequestDTO,
} from '@/features/orders/data/dtos/order.dto';

export const createOrdersApi = (axiosInstance: AxiosInstance) => ({
  listOrders: async (): Promise<OrderListResponseDTO> => {
    const { data } = await axiosInstance.get<OrderListResponseDTO>('/orders');
    return data;
  },

  getOrder: async (orderId: number): Promise<OrderDTO> => {
    const { data } = await axiosInstance.get<OrderDTO>(`/orders/${orderId}`);
    return data;
  },

  createOrder: async (request: CreateOrderRequestDTO): Promise<CreateOrderResponseDTO> => {
    const { data } = await axiosInstance.post<CreateOrderResponseDTO>('/orders', request);
    return data;
  },

  confirmOrder: async (orderId: number): Promise<OrderDTO> => {
    const { data } = await axiosInstance.post<OrderDTO>(`/orders/${orderId}/confirm`);
    return data;
  },

  updateOrderStatus: async (
    orderId: number,
    request: UpdateOrderStatusRequestDTO,
  ): Promise<OrderDTO> => {
    const { data } = await axiosInstance.put<OrderDTO>(`/orders/${orderId}/status`, request);
    return data;
  },

  listSellerOrders: async (): Promise<OrderListResponseDTO> => {
    const { data } = await axiosInstance.get<OrderListResponseDTO>('/orders/seller/me');
    return data;
  },

  getSellerOrderStats: async (): Promise<SellerOrderStatsDTO> => {
    const { data } = await axiosInstance.get<SellerOrderStatsDTO>('/orders/seller/stats');
    return data;
  },
});

export interface SellerOrderStatsDTO {
  total: number;
  pending: number;
  confirmed: number;
  shipped: number;
  delivered: number;
  completed: number;
}

export type OrdersApi = ReturnType<typeof createOrdersApi>;
