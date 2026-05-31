import type { IShipmentRepository } from '../../domain/repositories/shipment.repository';
import { ShipmentMapper } from '../mappers/shipment.mapper';
import type { ShipmentsApi } from '../api/shipments.api';

export const createShipmentRepository = (shipmentsApi: ShipmentsApi): IShipmentRepository => ({
  listShipments: async (page, limit) => {
    const dto = await shipmentsApi.listShipments(page, limit);
    return ShipmentMapper.toListEntity(dto);
  },

  getShipment: async (shipmentId) => {
    const dto = await shipmentsApi.getShipment(shipmentId);
    return ShipmentMapper.toEntity(dto);
  },
});
