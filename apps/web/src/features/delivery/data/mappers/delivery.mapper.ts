import type {
  ShipmentEntity,
  PaginatedShipments,
} from "@/features/delivery/domain/entities/delivery.entity";
export const deliveryMapper = {
  toEntity: (raw: ShipmentEntity): ShipmentEntity => ({
    ...raw,
    order: {
      ...raw.order,
      totalAmount: Number(raw.order.totalAmount),
      shippingFee: Number(raw.order.shippingFee),
      orderItems: raw.order.orderItems.map((item) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
      })),
    },
  }),

  toPaginated: (raw: PaginatedShipments): PaginatedShipments => ({
    ...raw,
    items: raw.items.map(deliveryMapper.toEntity),
  }),
};
