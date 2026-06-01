import type {
  Order,
  OrderItem,
  PaginatedOrderList,
  Payment,
  Shipment,
} from "@/features/orders/domain/entities/order.entity";
import type {
  OrderDTO,
  OrderItemDTO,
  PaymentDTO,
  ShipmentDTO,
  OrderListResponseDTO,
  CreateOrderResponseDTO,
  PaginatedOrderListDTO,
} from "@/features/orders/data/dtos/order.dto";

export const OrderMapper = {
  toBigIntNumber: (value: number | string | bigint): number => {
    return typeof value === "bigint"
      ? Number(value)
      : typeof value === "string"
        ? parseInt(value, 10)
        : value;
  },

  toOrderItemEntity: (dto: OrderItemDTO): OrderItem => ({
    orderItemId: dto.orderItemId,
    productId: dto.productId,
    quantity: dto.quantity,
    unitPrice: OrderMapper.toBigIntNumber(dto.unitPrice),
    product: {
      productId: dto.product.productId,
      name: dto.product.name,
      description: dto.product.description,
      price: OrderMapper.toBigIntNumber(dto.product.price),
      sellerId: dto.product.sellerId,
      images: dto.product.images,
    },
  }),

  toPaymentEntity: (dto: PaymentDTO): Payment => ({
    paymentId: dto.paymentId,
    method: dto.method,
    status: dto.status,
    amount: OrderMapper.toBigIntNumber(dto.amount),
    transactionId: dto.transactionId,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  }),

  toShipmentEntity: (dto: ShipmentDTO): Shipment => ({
    shipmentId: dto.shipmentId,
    shipperId: dto.shipperId,
    trackingCode: dto.trackingCode,
    status: dto.status,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  }),

  toEntity: (dto: OrderDTO): Order => ({
    orderId: dto.orderId,
    buyerId: dto.buyerId,
    sellerId: dto.sellerId,
    totalAmount: OrderMapper.toBigIntNumber(dto.totalAmount),
    paymentMethod: dto.paymentMethod,
    platformFee: OrderMapper.toBigIntNumber(dto.platformFee),
    sellerAmount: OrderMapper.toBigIntNumber(dto.sellerAmount),
    shippingFee: OrderMapper.toBigIntNumber(dto.shippingFee),
    shippingAddress: dto.shippingAddress,
    receiverName: dto.receiverName,
    receiverPhone: dto.receiverPhone,
    status: dto.status,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    orderItems: dto.orderItems.map(OrderMapper.toOrderItemEntity),
    shipment: dto.shipment ? OrderMapper.toShipmentEntity(dto.shipment) : null,
    payments: dto.payments.map(OrderMapper.toPaymentEntity),
    buyer: dto.buyer,
    seller: dto.seller,
  }),

  toOrderListEntity: (dtos: OrderListResponseDTO): Order[] =>
    dtos.map(OrderMapper.toEntity),
  toCreateOrderEntity: (dtos: CreateOrderResponseDTO): Order[] =>
    dtos.map(OrderMapper.toEntity),

  toPaginatedOrderList: (dto: PaginatedOrderListDTO): PaginatedOrderList => ({
    items: dto.items.map(OrderMapper.toEntity),
    pagination: dto.pagination,
  }),
};
