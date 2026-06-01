import type {
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  ShipmentStatus,
} from "@/features/orders/domain/entities/order.entity";

export interface OrderItemDTO {
  orderItemId: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  product: {
    productId: number;
    name: string;
    description: string;
    price: number;
    sellerId: number;
    images?: { imageUrl: string }[];
  };
}

export interface ShipmentDTO {
  shipmentId: number;
  orderId: number;
  shipperId: number | null;
  trackingCode: string | null;
  status: ShipmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentDTO {
  paymentId: number;
  orderId: number;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  transactionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDTO {
  orderId: number;
  buyerId: number;
  sellerId: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  platformFee: number;
  sellerAmount: number;
  shippingFee: number;
  shippingAddress: string;
  receiverName: string;
  receiverPhone: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItemDTO[];
  shipment: ShipmentDTO | null;
  payments: PaymentDTO[];
  buyer?: {
    buyerId: number;
    fullName: string;
    avatarUrl: string | null;
  };
  seller?: {
    sellerId: number;
    storeName: string;
  };
}

export type CreateOrderResponseDTO = OrderDTO[];
export type OrderListResponseDTO = OrderDTO[];

export interface CreateOrderRequestDTO {
  shippingAddress: string;
  receiverName: string;
  receiverPhone: string;
  paymentMethod: PaymentMethod;
}

export interface UpdateOrderStatusRequestDTO {
  status: OrderStatus;
}

export interface GetSellerOrdersQueryDTO {
  status?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedOrderListDTO {
  items: OrderDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrderStatItemDTO {
  status: string;
  count: number;
}

export interface SellerOrderStatsDTO {
  total: number;
  statistics: OrderStatItemDTO[];
}