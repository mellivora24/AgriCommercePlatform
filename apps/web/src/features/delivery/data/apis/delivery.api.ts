import { axiosInstance } from '@/core/network';
import type {
  PaginatedShipments,
  ShipmentEntity,
  ShipmentTab,
  ShipperAllowedStatus,
} from '@/features/delivery/domain/entities/delivery.entity';

export const deliveryApi = {
  getShipments: async (tab: ShipmentTab, page = 1): Promise<PaginatedShipments> => {
    const response = await axiosInstance.get<PaginatedShipments>('/delivery/shipments', {
      params: { tab, page },
    });
    return response.data;
  },

  getShipmentDetail: async (id: number): Promise<ShipmentEntity> => {
    const response = await axiosInstance.get<ShipmentEntity>(`/delivery/shipments/${id}`);
    return response.data;
  },

  acceptShipment: async (id: number): Promise<ShipmentEntity> => {
    const response = await axiosInstance.post<ShipmentEntity>(`/delivery/shipments/${id}/accept`);
    return response.data;
  },

  updateShipmentStatus: async (
    id: number,
    status: ShipperAllowedStatus,
  ): Promise<ShipmentEntity> => {
    const response = await axiosInstance.patch<ShipmentEntity>(
      `/delivery/shipments/${id}/status`,
      { status },
    );
    return response.data;
  },
};
