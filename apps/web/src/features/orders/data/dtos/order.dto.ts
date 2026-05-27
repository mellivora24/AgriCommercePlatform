import type { Order, OrderListResponse, PaymentMethod, OrderStatus } from '../../domain/entities/order.entity';

export interface OrderItemDTO {
  productId: string;
  sellerId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
}

export interface ShippingAddressDTO {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  street: string;
  ward: string;
  district: string;
  province: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

export interface OrderDTO extends Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItemDTO[];
  shippingAddress: ShippingAddressDTO;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface OrderListResponseDTO extends OrderListResponse {
  items: OrderDTO[];
}

export interface CreateOrderRequestDTO {
  items: OrderItemDTO[];
  shippingAddressId: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface UpdateOrderStatusRequestDTO {
  status: OrderStatus;
}
