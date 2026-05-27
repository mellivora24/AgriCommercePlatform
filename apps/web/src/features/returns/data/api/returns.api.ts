import type { AxiosInstance } from 'axios';
import type { CreateReturnRequest, Return, ReturnListResponse } from '../../domain/entities/return.entity';

export type ReturnDTO = Return;
export type ReturnListResponseDTO = ReturnListResponse;
export type CreateReturnRequestDTO = CreateReturnRequest;

export const createReturnsApi = (axiosInstance: AxiosInstance) => ({
  // Create return request
  createReturn: async (request: CreateReturnRequestDTO): Promise<ReturnDTO> => {
    const { data } = await axiosInstance.post('/returns', request);
    return data;
  },

  // Get specific return
  getReturn: async (returnId: string): Promise<ReturnDTO> => {
    const { data } = await axiosInstance.get(`/returns/${returnId}`);
    return data;
  },

  // List buyer's returns
  listReturns: async (page?: number, limit?: number): Promise<ReturnDTO[]> => {
    const { data } = await axiosInstance.get('/returns');
    return data;
  },

  // List buyer's returns (alias for listReturns)
  listBuyerReturns: async (): Promise<ReturnDTO[]> => {
    const { data } = await axiosInstance.get('/returns');
    return data;
  },

  // Get returns by order
  getOrderReturns: async (orderId: string): Promise<ReturnDTO[]> => {
    const { data } = await axiosInstance.get(`/returns/order/${orderId}`);
    return data;
  },

  // List seller's returns
  listSellerReturns: async (): Promise<ReturnDTO[]> => {
    const { data } = await axiosInstance.get('/returns/seller/me');
    return data;
  },

  // Approve return request
  approveReturn: async (returnId: string, dto: any): Promise<ReturnDTO> => {
    const { data } = await axiosInstance.put(`/returns/${returnId}/approve`, dto);
    return data;
  },

  // Reject return request
  rejectReturn: async (returnId: string, dto: any): Promise<ReturnDTO> => {
    const { data } = await axiosInstance.put(`/returns/${returnId}/reject`, dto);
    return data;
  },

  // Get pending returns
  getPendingReturns: async (): Promise<ReturnDTO[]> => {
    const { data } = await axiosInstance.get('/returns/pending/all');
    return data;
  },
});

export type ReturnsApi = ReturnType<typeof createReturnsApi>;
