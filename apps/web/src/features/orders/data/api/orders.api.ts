import type { AxiosInstance } from 'axios';
import type { CreateOrderRequestDTO, OrderDTO, OrderListResponseDTO, UpdateOrderStatusRequestDTO } from '../dtos/order.dto';

export const createOrdersApi = (axiosInstance: AxiosInstance) => ({
  // Buyer endpoints
  listOrders: async (page?: number, limit?: number): Promise<OrderDTO[]> => {
    const { data } = await axiosInstance.get('/orders');
    return data;
  },

  getOrder: async (orderId: string): Promise<OrderDTO> => {
    const { data } = await axiosInstance.get(`/orders/${orderId}`);
    return data;
  },

  createOrder: async (request: CreateOrderRequestDTO): Promise<OrderDTO> => {
    const { data } = await axiosInstance.post('/orders', request);
    return data;
  },

  confirmOrder: async (orderId: string): Promise<OrderDTO> => {
    const { data } = await axiosInstance.post(`/orders/${orderId}/confirm`);
    return data;
  },

  // Seller endpoints
  listSellerOrders: async (): Promise<OrderDTO[]> => {
    const { data } = await axiosInstance.get('/orders/seller/me');
    return data;
  },

  getSellerOrderStats: async () => {
    const { data } = await axiosInstance.get('/orders/seller/stats');
    return data;
  },

  updateOrderStatus: async (orderId: string, request: UpdateOrderStatusRequestDTO): Promise<OrderDTO> => {
    const { data } = await axiosInstance.put(`/orders/${orderId}/status`, request);
    return data;
  },
});

export type OrdersApi = ReturnType<typeof createOrdersApi>;
