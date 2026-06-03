import type { OrderStatus, PaymentStatus } from '@/core/types/enum';
import type { CartItem } from './cart.entity';

export interface Order {
  orderId: number;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  totalAmount: number;
  createdAt?: string;
  items?: CartItem[];
}

export interface OrderListResponse {
  items: Order[];
  total: number;
}
