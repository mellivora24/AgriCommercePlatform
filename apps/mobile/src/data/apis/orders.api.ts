import { axiosInstance } from '@/core/network';
import type { OrderDto, OrderListResponseDto } from '../dtos/order.dto';

export const ordersApi = {
  listOrders: async (): Promise<OrderListResponseDto> => {
    const response = await axiosInstance.get<OrderListResponseDto>('/orders');
    return response.data;
  },
  getOrder: async (orderId: number): Promise<OrderDto> => {
    const response = await axiosInstance.get<OrderDto>(`/orders/${orderId}`);
    return response.data;
  },
};
