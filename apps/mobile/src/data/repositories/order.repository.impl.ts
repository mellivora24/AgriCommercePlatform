import type { IOrderRepository, CreateOrderPayload, GetSellerOrdersParams } from '@/domain/repositories/order.repository';
import type { Order, OrderListResponse, OrderStats } from '@/domain/entities/order.entity';
import { ordersApi } from '../apis/orders.api';
import { OrderMapper } from '../mappers/order.mapper';

export class OrderRepositoryImpl implements IOrderRepository {
  async createOrder(payload: CreateOrderPayload): Promise<Order[]> {
    const dtos = await ordersApi.createOrder(payload);
    return dtos.map(OrderMapper.toEntity);
  }

  async getOrder(orderId: number): Promise<Order> {
    const dto = await ordersApi.getOrder(orderId);
    return OrderMapper.toEntity(dto);
  }

  async listBuyerOrders(): Promise<Order[]> {
    const dtos = await ordersApi.listBuyerOrders();
    return dtos.map(OrderMapper.toEntity);
  }

  async listSellerOrders(params: GetSellerOrdersParams): Promise<OrderListResponse> {
    const dto = await ordersApi.listSellerOrders(params);
    return OrderMapper.toListEntity(dto);
  }

  async getSellerOrderStats(): Promise<OrderStats> {
    const dto = await ordersApi.getSellerOrderStats();
    return OrderMapper.toStats(dto);
  }

  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    const dto = await ordersApi.updateOrderStatus(orderId, status);
    return OrderMapper.toEntity(dto);
  }

  async confirmOrder(orderId: number): Promise<Order> {
    const dto = await ordersApi.confirmOrder(orderId);
    return OrderMapper.toEntity(dto);
  }

  async cancelOrder(orderId: number): Promise<Order> {
    const dto = await ordersApi.cancelOrder(orderId);
    return OrderMapper.toEntity(dto);
  }
}
