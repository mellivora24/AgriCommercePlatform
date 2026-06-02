import type {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ProductStatus,
  SellerStatus,
  ShipmentStatus,
  UserRole,
  AccountStatus,
  WithdrawalStatus,
} from '@/core/types/enum';

export interface PaginationDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SellerDashboardStatisticsDto {
  totalProducts: number;
  availableProducts: number;
  outOfStockProducts: number;
  totalOrders: number;
  waitingOrders: number;
  shippingOrders: number;
  completedOrders: number;
  totalRevenue: string;
}

export interface SellerWalletDto {
  sellerId: number;
  pendingBalance: string;
  availableBalance: string;
  reservedBalance: string;
  withdrawingBalance: string;
  onHoldBalance: string;
  lifetimeEarned: string;
  lifetimeWithdrawn: string;
  createdAt: string;
  updatedAt: string;
}

export interface BuyerDto {
  buyerId: number;
  userId: number;
  fullName: string;
  avatarUrl: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecentOrderDto {
  orderId: number;
  buyerId: number;
  sellerId: number;
  totalAmount: string;
  paymentMethod: PaymentMethod;
  shippingFee: string;
  platformFee: string;
  sellerAmount: string;
  shippingAddress: string;
  receiverName: string;
  receiverPhone: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  buyer: BuyerDto;
}

export interface OrderStatusSummaryDto {
  _count: number;
  status: OrderStatus;
}

export interface RevenueChartDto {
  date: string;
  revenue: string;
}

export interface OrderChartDto {
  date: string;
  orders: string;
}

export interface TopProductDto {
  productId: number;
  name: string;
  totalSold: number;
  revenue: string;
}

export interface SellerDashboardResponseDto {
  statistics: SellerDashboardStatisticsDto;
  wallet: SellerWalletDto;
  recentOrders: RecentOrderDto[];
  orderStatusSummary: OrderStatusSummaryDto[];
  revenueChart: RevenueChartDto[];
  orderChart: OrderChartDto[];
  topProducts: TopProductDto[];
}

export interface ProductCategoryDto {
  categoryId: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImageDto {
  imageId: number;
  productId: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface SellerProductDto {
  productId: number;
  sellerId: number;
  categoryId: number;
  name: string;
  description: string;
  price: string;
  stockQuantity: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  category: ProductCategoryDto;
  images: ProductImageDto[];
}

export interface SellerProductsResponseDto {
  items: SellerProductDto[];
  pagination: PaginationDto;
}

export interface GetSellerProductsQueryDto {
  page?: number;
  limit?: number;
  keyword?: string;
  categoryId?: number;
  status?: ProductStatus;
}

export interface BuyerUserDto {
  userId: number;
  nickname: string | null;
  email: string;
  phone: string | null;
  role: UserRole;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface BuyerWithUserDto extends BuyerDto {
  user: BuyerUserDto;
}

export interface OrderItemProductDto {
  productId: number;
  sellerId: number;
  categoryId: number;
  name: string;
  description: string;
  price: string;
  stockQuantity: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  images: ProductImageDto[];
}

export interface OrderItemDto {
  orderItemId: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: string;
  createdAt: string;
  updatedAt: string;
  product: OrderItemProductDto;
}

export interface ShipmentDto {
  shipmentId: number;
  orderId: number;
  shipperId: number | null;
  trackingCode: string | null;
  status: ShipmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentDto {
  paymentId: number;
  orderId: number;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: string;
  transactionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SellerOrderDto {
  orderId: number;
  buyerId: number;
  sellerId: number;
  totalAmount: string;
  paymentMethod: PaymentMethod;
  shippingFee: string;
  platformFee: string;
  sellerAmount: string;
  shippingAddress: string;
  receiverName: string;
  receiverPhone: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  buyer: BuyerWithUserDto;
  orderItems: OrderItemDto[];
  shipment: ShipmentDto;
  payments: PaymentDto[];
}

export interface SellerOrdersResponseDto {
  items: SellerOrderDto[];
  statistics: OrderStatusSummaryDto[];
  pagination: PaginationDto;
}

export interface GetSellerOrdersQueryDto {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  keyword?: string;
}

export interface SellerUserDto {
  userId: number;
  nickname: string | null;
  email: string;
  phone: string | null;
  role: UserRole;
  status: AccountStatus;
}

export interface BankAccountDto {
  bankAccountId: number;
  sellerId: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SellerSettingsResponseDto {
  sellerId: number;
  userId: number;
  storeName: string;
  storeDescription: string;
  platformFeeRate: string;
  status: SellerStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: SellerUserDto;
  bankAccounts: BankAccountDto[];
  wallet: SellerWalletDto;
}

// ─── Settings update ─────────────────────────────────────────────────────────

export interface UpdateSellerSettingsDto {
  storeName?: string;
  storeDescription?: string;
}

// ─── Withdraw ────────────────────────────────────────────────────────────────

export interface SellerWithdrawDto {
  amount: number;
  bankAccountId: number;
}

export interface SellerWithdrawResponseDto {
  withdrawalId: number;
  sellerId: number;
  bankAccountId: number;
  amount: string;
  withdrawalFee: string;
  netPayout: string;
  status: WithdrawalStatus;
  transferReference: string | null;
  providerResponse: string | null;
  providerStatus: string | null;
  failureReason: string | null;
  retryCount: number;
  requestedAt: string;
  processedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Bank account ─────────────────────────────────────────────────────────────

export interface CreateSellerBankAccountDto {
  bankName: string;
  accountNumber: string;
  accountName: string;
  isPrimary?: boolean;
}

export interface UpdateSellerBankAccountDto {
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  isPrimary?: boolean;
}

export type SellerBankAccountResponseDto = BankAccountDto;
