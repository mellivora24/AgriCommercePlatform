import type { Shipment, ShipmentListResponse } from '../entities/shipment.entity';
import type { IShipmentRepository } from '../repositories/shipment.repository';

export interface ListShipmentsUseCase {
  execute(page: number, limit: number): Promise<ShipmentListResponse>;
}

export interface GetShipmentUseCase {
  execute(shipmentId: string): Promise<Shipment>;
}

export const createListShipmentsUseCase = (repository: IShipmentRepository): ListShipmentsUseCase => ({
  execute: (page, limit) => repository.listShipments(page, limit),
});

export const createGetShipmentUseCase = (repository: IShipmentRepository): GetShipmentUseCase => ({
  execute: (shipmentId) => repository.getShipment(shipmentId),
});
