import type { OrderStatus, PaymentMethod, PaymentStatus, ShipmentStatus } from '@/core/types/enum';

export interface OrderItemProductDto {
  productId: number;
  name: string;
  images: { url: string }[];
}

export interface OrderItemDto {
  orderItemId: number;
  productId: number;
  quantity: number;
  unitPrice: number | string;
  product: OrderItemProductDto;
}

export interface OrderShipmentDto {
  shipmentId: number;
  status: ShipmentStatus;
}

export interface OrderPaymentDto {
  paymentId: number;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number | string;
}

export interface OrderBuyerDto {
  buyerId: number;
  fullName: string;
  user: { email: string };
}

export interface OrderDto {
  orderId: number;
  buyerId: number;
  sellerId: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  totalAmount: number | string;
  platformFee: number | string;
  shippingAddress: string;
  receiverName: string;
  receiverPhone: string;
  createdAt: string;
  orderItems: OrderItemDto[];
  shipment: OrderShipmentDto | null;
  payments: OrderPaymentDto[];
  buyer?: OrderBuyerDto;
  seller?: { sellerId: number; shopName: string };
}

export interface OrderListResponseDto {
  items: OrderDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrderStatItemDto {
  status: OrderStatus;
  count: number;
}

export interface OrderStatsDto {
  total: number;
  statistics: OrderStatItemDto[];
}

export interface CreateOrderRequestDto {
  paymentMethod: 'ONLINE' | 'COD';
  shippingAddress: string;
  receiverName: string;
  receiverPhone: string;
}
