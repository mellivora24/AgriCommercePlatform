import type { OrderStatus, PaymentStatus } from '@/core/types/enum';
import type { CartItemDto } from './cart.dto';

export interface OrderDto {
  orderId: number;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  totalAmount: number;
  createdAt?: string;
  items?: CartItemDto[];
}

export interface OrderListResponseDto {
  items: OrderDto[];
  total: number;
}
import type { OrderStatus, PaymentStatus } from '@/core/types/enum';
import type { CartItemDto } from './cart.dto';

export interface OrderDto {
  orderId: number;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  totalAmount: number;
  createdAt?: string;
  items?: CartItemDto[];
}

export interface OrderListResponseDto {
  items: OrderDto[];
  total: number;
}
