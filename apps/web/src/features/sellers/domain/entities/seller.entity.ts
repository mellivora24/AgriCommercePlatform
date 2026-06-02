import type {
  AccountStatus,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ProductStatus,
  SellerStatus,
  ShipmentStatus,
  UserRole,
  WithdrawalStatus,
} from "@/core/types/enum";

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SellerStatistics {
  totalProducts: number;
  availableProducts: number;
  outOfStockProducts: number;
  totalOrders: number;
  waitingOrders: number;
  shippingOrders: number;
  completedOrders: number;
  totalRevenue: number;
}

export interface SellerWallet {
  sellerId: number;
  pendingBalance: number;
  availableBalance: number;
  reservedBalance: number;
  withdrawingBalance: number;
  onHoldBalance: number;
  lifetimeEarned: number;
  lifetimeWithdrawn: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardBuyer {
  buyerId: number;
  userId: number;
  fullName: string;
  avatarUrl: string;
  address: string;
}

export interface DashboardRecentOrder {
  orderId: number;
  buyerId: number;
  sellerId: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  shippingFee: number;
  platformFee: number;
  sellerAmount: number;
  shippingAddress: string;
  receiverName: string;
  receiverPhone: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  buyer: DashboardBuyer;
}

export interface OrderStatusCount {
  status: OrderStatus;
  count: number;
}

export interface RevenueChartPoint {
  date: Date;
  revenue: number;
}

export interface OrderChartPoint {
  date: Date;
  orders: number;
}

export interface TopProduct {
  productId: number;
  name: string;
  totalSold: number;
  revenue: number;
}

export interface SellerDashboard {
  statistics: SellerStatistics;
  wallet: SellerWallet;
  recentOrders: DashboardRecentOrder[];
  orderStatusSummary: OrderStatusCount[];
  revenueChart: RevenueChartPoint[];
  orderChart: OrderChartPoint[];
  topProducts: TopProduct[];
}

export interface ProductCategory {
  categoryId: number;
  name: string;
  description: string;
}

export interface ProductImage {
  imageId: number;
  productId: number;
  imageUrl: string;
}

export interface SellerProduct {
  productId: number;
  sellerId: number;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  category: ProductCategory;
  images: ProductImage[];
}

export interface SellerProductList {
  items: SellerProduct[];
  pagination: Pagination;
}

export interface SellerProductsFilter {
  page?: number;
  limit?: number;
  keyword?: string;
  categoryId?: number;
  status?: ProductStatus;
}

export interface OrderBuyerUser {
  userId: number;
  nickname: string | null;
  email: string;
  phone: string | null;
  role: UserRole;
  status: AccountStatus;
}

export interface OrderBuyer {
  buyerId: number;
  userId: number;
  fullName: string;
  avatarUrl: string;
  address: string;
  user: OrderBuyerUser;
}

export interface OrderItemProduct {
  productId: number;
  name: string;
  price: number;
  status: ProductStatus;
  images: ProductImage[];
}

export interface OrderItem {
  orderItemId: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  product: OrderItemProduct;
}

export interface Shipment {
  shipmentId: number;
  orderId: number;
  shipperId: number | null;
  trackingCode: string | null;
  status: ShipmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  paymentId: number;
  orderId: number;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  transactionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SellerOrder {
  orderId: number;
  buyerId: number;
  sellerId: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  shippingFee: number;
  platformFee: number;
  sellerAmount: number;
  shippingAddress: string;
  receiverName: string;
  receiverPhone: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  buyer: OrderBuyer;
  orderItems: OrderItem[];
  shipment: Shipment;
  payments: Payment[];
}

export interface SellerOrderList {
  items: SellerOrder[];
  statistics: OrderStatusCount[];
  pagination: Pagination;
}

export interface SellerOrdersFilter {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  keyword?: string;
}

export interface SellerUser {
  userId: number;
  nickname: string | null;
  email: string;
  phone: string | null;
  role: UserRole;
  status: AccountStatus;
}

export interface BankAccount {
  bankAccountId: number;
  sellerId: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SellerSettings {
  sellerId: number;
  userId: number;
  storeName: string;
  storeDescription: string;
  platformFeeRate: number;
  status: SellerStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  user: SellerUser;
  bankAccounts: BankAccount[];
  wallet: SellerWallet;
}

export interface SellerWithdrawal {
  withdrawalId: number;
  sellerId: number;
  bankAccountId: number;
  amount: number;
  withdrawalFee: number;
  netPayout: number;
  status: WithdrawalStatus;
  transferReference: string | null;
  providerResponse: string | null;
  providerStatus: string | null;
  failureReason: string | null;
  retryCount: number;
  requestedAt: Date;
  processedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateSellerSettingsInput {
  storeName?: string;
  storeDescription?: string;
}

export interface SellerWithdrawInput {
  amount: number;
  bankAccountId: number;
}

export interface CreateBankAccountInput {
  bankName: string;
  accountNumber: string;
  accountName: string;
  isPrimary?: boolean;
}

export interface UpdateBankAccountInput {
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  isPrimary?: boolean;
}
