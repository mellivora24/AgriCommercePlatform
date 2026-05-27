export type ShipmentStatus = 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed';

export interface ShipmentItem {
  productId: string;
  name: string;
  quantity: number;
  sku: string;
}

export interface TrackingEvent {
  timestamp: string;
  status: ShipmentStatus;
  location: string;
  description: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  trackingNumber: string;
  carrier: string;
  status: ShipmentStatus;
  items: ShipmentItem[];
  estimatedDelivery?: string;
  actualDelivery?: string;
  trackingEvents: TrackingEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentListResponse {
  items: Shipment[];
  total: number;
  page: number;
  limit: number;
}
