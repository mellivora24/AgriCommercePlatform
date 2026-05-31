import type {
  BankAccountDto,
  BuyerDto,
  BuyerWithUserDto,
  OrderChartDto,
  OrderItemDto,
  OrderStatusSummaryDto,
  PaymentDto,
  RecentOrderDto,
  RevenueChartDto,
  SellerDashboardResponseDto,
  SellerOrderDto,
  SellerOrdersResponseDto,
  SellerProductDto,
  SellerProductsResponseDto,
  SellerSettingsResponseDto,
  SellerWalletDto,
  ShipmentDto,
  TopProductDto,
} from '@/features/sellers/data/dtos/seller.dto';
import type {
  BankAccount,
  DashboardBuyer,
  DashboardRecentOrder,
  OrderBuyer,
  OrderChartPoint,
  OrderItem,
  OrderStatusCount,
  Payment,
  RevenueChartPoint,
  SellerDashboard,
  SellerOrder,
  SellerOrderList,
  SellerProduct,
  SellerProductList,
  SellerSettings,
  SellerWallet,
  Shipment,
  TopProduct,
} from '@/features/sellers/domain/entities/seller.entity';

function mapWallet(dto: SellerWalletDto): SellerWallet {
  return {
    sellerId: dto.sellerId,
    pendingBalance: Number(dto.pendingBalance),
    availableBalance: Number(dto.availableBalance),
    reservedBalance: Number(dto.reservedBalance),
    withdrawingBalance: Number(dto.withdrawingBalance),
    onHoldBalance: Number(dto.onHoldBalance),
    lifetimeEarned: Number(dto.lifetimeEarned),
    lifetimeWithdrawn: Number(dto.lifetimeWithdrawn),
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}

function mapDashboardBuyer(dto: BuyerDto): DashboardBuyer {
  return {
    buyerId: dto.buyerId,
    userId: dto.userId,
    fullName: dto.fullName,
    avatarUrl: dto.avatarUrl,
    address: dto.address,
  };
}

function mapRecentOrder(dto: RecentOrderDto): DashboardRecentOrder {
  return {
    orderId: dto.orderId,
    buyerId: dto.buyerId,
    sellerId: dto.sellerId,
    totalAmount: Number(dto.totalAmount),
    paymentMethod: dto.paymentMethod,
    shippingFee: Number(dto.shippingFee),
    platformFee: Number(dto.platformFee),
    sellerAmount: Number(dto.sellerAmount),
    shippingAddress: dto.shippingAddress,
    receiverName: dto.receiverName,
    receiverPhone: dto.receiverPhone,
    status: dto.status,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    buyer: mapDashboardBuyer(dto.buyer),
  };
}

function mapOrderStatusSummary(dto: OrderStatusSummaryDto): OrderStatusCount {
  return { status: dto.status, count: dto._count };
}

function mapRevenueChart(dto: RevenueChartDto): RevenueChartPoint {
  return { date: new Date(dto.date), revenue: Number(dto.revenue) };
}

function mapOrderChart(dto: OrderChartDto): OrderChartPoint {
  return { date: new Date(dto.date), orders: Number(dto.orders) };
}

function mapTopProduct(dto: TopProductDto): TopProduct {
  return {
    productId: dto.productId,
    name: dto.name,
    totalSold: dto.totalSold,
    revenue: Number(dto.revenue),
  };
}

export function mapDashboard(dto: SellerDashboardResponseDto): SellerDashboard {
  return {
    statistics: {
      totalProducts: dto.statistics.totalProducts,
      availableProducts: dto.statistics.availableProducts,
      outOfStockProducts: dto.statistics.outOfStockProducts,
      totalOrders: dto.statistics.totalOrders,
      waitingOrders: dto.statistics.waitingOrders,
      shippingOrders: dto.statistics.shippingOrders,
      completedOrders: dto.statistics.completedOrders,
      totalRevenue: Number(dto.statistics.totalRevenue),
    },
    wallet: mapWallet(dto.wallet),
    recentOrders: dto.recentOrders.map(mapRecentOrder),
    orderStatusSummary: dto.orderStatusSummary.map(mapOrderStatusSummary),
    revenueChart: dto.revenueChart.map(mapRevenueChart),
    orderChart: dto.orderChart.map(mapOrderChart),
    topProducts: dto.topProducts.map(mapTopProduct),
  };
}

function mapProduct(dto: SellerProductDto): SellerProduct {
  return {
    productId: dto.productId,
    sellerId: dto.sellerId,
    categoryId: dto.categoryId,
    name: dto.name,
    description: dto.description,
    price: Number(dto.price),
    stockQuantity: dto.stockQuantity,
    status: dto.status,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : null,
    category: {
      categoryId: dto.category.categoryId,
      name: dto.category.name,
      description: dto.category.description,
    },
    images: dto.images.map((img) => ({
      imageId: img.imageId,
      productId: img.productId,
      imageUrl: img.imageUrl,
    })),
  };
}

export function mapProducts(dto: SellerProductsResponseDto): SellerProductList {
  return {
    items: dto.items.map(mapProduct),
    pagination: dto.pagination,
  };
}

function mapOrderBuyer(dto: BuyerWithUserDto): OrderBuyer {
  return {
    buyerId: dto.buyerId,
    userId: dto.userId,
    fullName: dto.fullName,
    avatarUrl: dto.avatarUrl,
    address: dto.address,
    user: {
      userId: dto.user.userId,
      nickname: dto.user.nickname,
      email: dto.user.email,
      phone: dto.user.phone,
      role: dto.user.role,
      status: dto.user.status,
    },
  };
}

function mapOrderItem(dto: OrderItemDto): OrderItem {
  return {
    orderItemId: dto.orderItemId,
    orderId: dto.orderId,
    productId: dto.productId,
    quantity: dto.quantity,
    unitPrice: Number(dto.unitPrice),
    product: {
      productId: dto.product.productId,
      name: dto.product.name,
      price: Number(dto.product.price),
      status: dto.product.status,
      images: dto.product.images.map((img) => ({
        imageId: img.imageId,
        productId: img.productId,
        imageUrl: img.imageUrl,
      })),
    },
  };
}

function mapShipment(dto: ShipmentDto): Shipment {
  return {
    shipmentId: dto.shipmentId,
    orderId: dto.orderId,
    shipperId: dto.shipperId,
    trackingCode: dto.trackingCode,
    status: dto.status,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}

function mapPayment(dto: PaymentDto): Payment {
  return {
    paymentId: dto.paymentId,
    orderId: dto.orderId,
    method: dto.method,
    status: dto.status,
    amount: Number(dto.amount),
    transactionId: dto.transactionId,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}

function mapOrder(dto: SellerOrderDto): SellerOrder {
  return {
    orderId: dto.orderId,
    buyerId: dto.buyerId,
    sellerId: dto.sellerId,
    totalAmount: Number(dto.totalAmount),
    paymentMethod: dto.paymentMethod,
    shippingFee: Number(dto.shippingFee),
    platformFee: Number(dto.platformFee),
    sellerAmount: Number(dto.sellerAmount),
    shippingAddress: dto.shippingAddress,
    receiverName: dto.receiverName,
    receiverPhone: dto.receiverPhone,
    status: dto.status,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    buyer: mapOrderBuyer(dto.buyer),
    orderItems: dto.orderItems.map(mapOrderItem),
    shipment: mapShipment(dto.shipment),
    payments: dto.payments.map(mapPayment),
  };
}

export function mapOrders(dto: SellerOrdersResponseDto): SellerOrderList {
  return {
    items: dto.items.map(mapOrder),
    statistics: dto.statistics.map(mapOrderStatusSummary),
    pagination: dto.pagination,
  };
}

function mapBankAccount(dto: BankAccountDto): BankAccount {
  return {
    bankAccountId: dto.bankAccountId,
    sellerId: dto.sellerId,
    bankName: dto.bankName,
    accountNumber: dto.accountNumber,
    accountName: dto.accountName,
    isPrimary: dto.isPrimary,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}

export function mapSettings(dto: SellerSettingsResponseDto): SellerSettings {
  return {
    sellerId: dto.sellerId,
    userId: dto.userId,
    storeName: dto.storeName,
    storeDescription: dto.storeDescription,
    platformFeeRate: Number(dto.platformFeeRate),
    status: dto.status,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : null,
    user: dto.user,
    bankAccounts: dto.bankAccounts.map(mapBankAccount),
    wallet: mapWallet(dto.wallet),
  };
}
