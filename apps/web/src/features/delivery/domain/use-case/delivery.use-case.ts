import type { DeliveryRepository } from "@/features/delivery/domain/repositories/delivery.repository";
import type {
  ShipmentTab,
  ShipperAllowedStatus,
} from "@/features/delivery/domain/entities/delivery.entity";

export class DeliveryUseCase {
  private readonly repo: DeliveryRepository;

  constructor(repo: DeliveryRepository) {
    this.repo = repo;
  }

  getShipments(tab: ShipmentTab, page?: number) {
    return this.repo.getShipments(tab, page);
  }

  getShipmentDetail(id: number) {
    return this.repo.getShipmentDetail(id);
  }

  acceptShipment(id: number) {
    return this.repo.acceptShipment(id);
  }

  updateShipmentStatus(id: number, status: ShipperAllowedStatus) {
    return this.repo.updateShipmentStatus(id, status);
  }
}
