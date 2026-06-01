export type OrderStatus =
  | 'PENDING_PAYMENT'
  | "PAID"
  | 'WAITING_SELLER_CONFIRMATION'
  | 'SELLER_CONFIRMED'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'REFUNDED';
export type PaymentStatus =
  | 'PENDING'
  | 'WAITING_COD_COLLECTION'
  | 'WAITING_ONLINE_PAYMENT'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED';
export type PaymentMethod = 'COD' | 'ONLINE';

export interface OrderItem {
  orderItemId: number;
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

export interface ShippingInfo {
  shippingAddress: string;
  receiverName: string;
  receiverPhone: string;
}

export interface Shipment {
  shipmentId: number;
  shipperId: number | null;
  trackingCode: string | null;
  status: ShipmentStatus;
  createdAt: string;
  updatedAt: string;
}

export type ShipmentStatus =
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'FAILED';

export interface Payment {
  paymentId: number;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  transactionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
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
  orderItems: OrderItem[];
  shipment: Shipment | null;
  payments: Payment[];
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

export type OrderListResponse = Order[];
export interface CreateOrderRequest {
  paymentMethod: PaymentMethod;
  shippingAddress: string;
  receiverName: string;
  receiverPhone: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface GetSellerOrdersParams {
  status?: OrderStatus;
  keyword?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedOrderList {
  items: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
