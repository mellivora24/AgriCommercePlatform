export type ShipmentTab = 'pending' | 'active' | 'done';

export type ShipmentStatus =
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'DELIVERING'
  | 'DELIVERED'
  | 'RETURNING'
  | 'RETURNED';

export type ShipperAllowedStatus = Exclude<ShipmentStatus, 'ASSIGNED'>;

export interface OrderItemEntity {
  orderItemId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  product: {
    name: string;
    productImages: { imageUrl: string }[];
  };
}

export interface ShipmentEntity {
  shipmentId: number;
  orderId: number;
  shipperId: number | null;
  trackingCode: string | null;
  status: ShipmentStatus;
  createdAt: string;
  updatedAt: string;
  order: {
    orderId: number;
    totalAmount: number;
    shippingFee: number;
    shippingAddress: string;
    receiverName: string;
    receiverPhone: string;
    paymentMethod: 'ONLINE' | 'COD';
    status: string;
    createdAt: string;
    buyer: { fullName: string; avatarUrl: string | null };
    seller: { storeName: string };
    orderItems: OrderItemEntity[];
  };
}

export interface PaginatedShipments {
  items: ShipmentEntity[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
