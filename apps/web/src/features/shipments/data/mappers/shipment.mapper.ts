import type { Shipment, ShipmentListResponse } from '../../domain/entities/shipment.entity';
import type { ShipmentDTO, ShipmentListResponseDTO } from '../api/shipments.api';

export const ShipmentMapper = {
  toEntity: (dto: ShipmentDTO): Shipment => dto,
  toListEntity: (dto: ShipmentListResponseDTO): ShipmentListResponse => dto,
};
