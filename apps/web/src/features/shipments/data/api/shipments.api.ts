import type { AxiosInstance } from 'axios';
import type { Shipment, ShipmentListResponse } from '../../domain/entities/shipment.entity';

export type ShipmentDTO = Shipment;
export type ShipmentListResponseDTO = ShipmentListResponse;

export const createShipmentsApi = (axiosInstance: AxiosInstance) => ({
  // List shipments with pagination
  listShipments: async (page?: number, limit?: number): Promise<ShipmentDTO[]> => {
    const { data } = await axiosInstance.get('/shipments');
    return data;
  },

  // Get specific shipment
  getShipment: async (shipmentId: string): Promise<ShipmentDTO> => {
    const { data } = await axiosInstance.get(`/shipments/${shipmentId}`);
    return data;
  },

  // Get shipment by order
  getOrderShipment: async (orderId: string): Promise<ShipmentDTO> => {
    const { data } = await axiosInstance.get(`/shipments/order/${orderId}`);
    return data;
  },

  // Track shipment by tracking code
  trackShipment: async (trackingCode: string): Promise<ShipmentDTO> => {
    const { data } = await axiosInstance.get(`/shipments/track/${trackingCode}`);
    return data;
  },

  // Update shipment
  updateShipment: async (shipmentId: string, dto: any): Promise<ShipmentDTO> => {
    const { data } = await axiosInstance.put(`/shipments/${shipmentId}`, dto);
    return data;
  },

  // Get shipper's shipments
  getMyShipments: async (): Promise<ShipmentDTO[]> => {
    const { data } = await axiosInstance.get('/shipments/shipper/me');
    return data;
  },

  // Update shipment status
  updateStatus: async (shipmentId: string, status: string): Promise<ShipmentDTO> => {
    const { data } = await axiosInstance.put(`/shipments/${shipmentId}/status/${status}`);
    return data;
  },
});

export type ShipmentsApi = ReturnType<typeof createShipmentsApi>;
