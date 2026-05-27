export interface OrderItem {
  productId: string;
  sellerId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
}

export interface ShippingAddress {
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

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'bank_transfer' | 'wallet';

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderListResponse {
  items: Order[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddressId: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}
