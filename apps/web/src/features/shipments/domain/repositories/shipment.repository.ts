import type { Shipment, ShipmentListResponse } from '../entities/shipment.entity';

export interface IShipmentRepository {
  listShipments(page: number, limit: number): Promise<ShipmentListResponse>;
  getShipment(shipmentId: string): Promise<Shipment>;
}
