import type {
  PaginatedShipments,
  ShipmentEntity,
  ShipmentTab,
  ShipperAllowedStatus,
} from '@/features/delivery/domain/entities/delivery.entity';

export interface DeliveryRepository {
  getShipments(tab: ShipmentTab, page?: number): Promise<PaginatedShipments>;
  getShipmentDetail(id: number): Promise<ShipmentEntity>;
  acceptShipment(id: number): Promise<ShipmentEntity>;
  updateShipmentStatus(id: number, status: ShipperAllowedStatus): Promise<ShipmentEntity>;
}
