import type { OrderStatus, PaymentMethod, PaymentStatus, ShipmentStatus } from '@/core/types/enum';

export interface OrderItemProduct {
  productId: number;
  name: string;
  images: { url: string }[];
}

export interface OrderItem {
  orderItemId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  product: OrderItemProduct;
}

export interface OrderShipment {
  shipmentId: number;
  status: ShipmentStatus;
}

export interface OrderPayment {
  paymentId: number;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
}

export interface OrderBuyer {
  buyerId: number;
  fullName: string;
  user: { email: string };
}

export interface Order {
  orderId: number;
  buyerId: number;
  sellerId: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  platformFee: number;
  shippingAddress: string;
  receiverName: string;
  receiverPhone: string;
  createdAt: string;
  orderItems: OrderItem[];
  shipment: OrderShipment | null;
  payments: OrderPayment[];
  buyer?: OrderBuyer;
  seller?: { sellerId: number; shopName: string };
}

export interface OrderListResponse {
  items: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrderStatItem {
  status: OrderStatus;
  count: number;
}

export interface OrderStats {
  total: number;
  statistics: OrderStatItem[];
}
