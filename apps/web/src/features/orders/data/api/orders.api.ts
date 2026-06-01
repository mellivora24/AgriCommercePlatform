import type { AxiosInstance } from 'axios';
import type {
  CreateOrderRequestDTO,
  CreateOrderResponseDTO,
  OrderDTO,
  OrderListResponseDTO,
  UpdateOrderStatusRequestDTO,
  GetSellerOrdersQueryDTO,
  PaginatedOrderListDTO,
  SellerOrderStatsDTO,
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

  cancelOrder: async (orderId: number): Promise<OrderDTO> => {
    const { data } = await axiosInstance.post<OrderDTO>(`/orders/${orderId}/cancel`);
    return data;
  },

  updateOrderStatus: async (
    orderId: number,
    request: UpdateOrderStatusRequestDTO,
  ): Promise<OrderDTO> => {
    const { data } = await axiosInstance.put<OrderDTO>(`/orders/${orderId}/status`, request);
    return data;
  },

  listSellerOrders: async (params?: GetSellerOrdersQueryDTO): Promise<PaginatedOrderListDTO> => {
    const { data } = await axiosInstance.get<PaginatedOrderListDTO>('/orders/seller/me', {
      params,
    });
    return data;
  },

  getSellerOrderStats: async (): Promise<SellerOrderStatsDTO> => {
    const { data } = await axiosInstance.get<SellerOrderStatsDTO>('/orders/seller/stats');
    return data;
  },
});

export type OrdersApi = ReturnType<typeof createOrdersApi>;
