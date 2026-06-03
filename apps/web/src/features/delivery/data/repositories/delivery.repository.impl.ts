import type { DeliveryRepository } from '@/features/delivery/domain/repositories/delivery.repository';
import type {
  PaginatedShipments,
  ShipmentEntity,
  ShipmentTab,
  ShipperAllowedStatus,
} from '@/features/delivery/domain/entities/delivery.entity';
import { deliveryApi } from '@/features/delivery/data/apis/delivery.api';
import { deliveryMapper } from '@/features/delivery/data/mappers/delivery.mapper';

export class DeliveryRepositoryImpl implements DeliveryRepository {
  async getShipments(tab: ShipmentTab, page = 1): Promise<PaginatedShipments> {
    const data = await deliveryApi.getShipments(tab, page);
    return deliveryMapper.toPaginated(data);
  }

  async getShipmentDetail(id: number): Promise<ShipmentEntity> {
    const data = await deliveryApi.getShipmentDetail(id);
    return deliveryMapper.toEntity(data);
  }

  async acceptShipment(id: number): Promise<ShipmentEntity> {
    const data = await deliveryApi.acceptShipment(id);
    return deliveryMapper.toEntity(data);
  }

  async updateShipmentStatus(id: number, status: ShipperAllowedStatus): Promise<ShipmentEntity> {
    const data = await deliveryApi.updateShipmentStatus(id, status);
    return deliveryMapper.toEntity(data);
  }
}
