export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface DashboardStats {
  users: {
    total: number;
    buyers: number;
    sellers: number;
    shippers: number;
  };
  orders: {
    total: number;
    completed: number;
    cancelled: number;
    byStatus: { status: string; count: number }[];
  };
  finance: {
    totalGmv: number;
    totalPlatformFee: number;
    platformWallet: {
      escrowBalance: number;
      revenueBalance: number;
      reserveBalance: number;
    } | null;
  };
  pending: {
    sellerApprovals: number;
    withdrawalsPending: number;
    withdrawalsProcessing: number;
    returnRequests: number;
  };
  recentOrders: OrderSummary[];
}

export interface AdminUser {
  userId: number;
  email: string;
  nickname: string | null;
  phone: string | null;
  role: string;
  status: string;
  createdAt: Date;
  buyerProfile: { fullName: string; avatarUrl: string | null; orderCount?: number } | null;
  sellerProfile: {
    sellerId: number;
    storeName: string;
    status: string;
    wallet?: SellerWallet | null;
    productCount?: number;
    orderCount?: number;
  } | null;
  shipperProfile: { shipperId: number; status: string } | null;
  adminProfile: { adminId: number; role: string } | null;
}

export interface SellerWallet {
  pendingBalance: number;
  availableBalance: number;
  reservedBalance: number;
  withdrawingBalance: number;
  onHoldBalance: number;
  lifetimeEarned: number;
  lifetimeWithdrawn: number;
}

export interface Store {
  sellerId: number;
  storeName: string;
  storeDescription: string | null;
  platformFeeRate: number;
  status: string;
  createdAt: Date;
  user: {
    userId: number;
    email: string;
    phone: string | null;
    status: string;
    createdAt: Date;
  };
  wallet: SellerWallet | null;
  counts: { products: number; orders: number; withdrawalRequests: number };
  orderStats: {
    totalRevenue: number;
    platformFeeEarned: number;
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
  };
}

export interface StoreDetail extends Omit<Store, 'orderStats'> {
  bankAccounts: BankAccount[];
  orderSummary: {
    totalRevenue: number;
    platformFeeEarned: number;
    byStatus: { status: string; count: number; revenue: number }[];
  };
}

export interface BankAccount {
  bankAccountId: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isPrimary: boolean;
}

export interface AdminProduct {
  productId: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number | null;
  status: string;
  createdAt: Date;
  seller: { sellerId: number; storeName: string };
  category: { categoryId: number; name: string } | null;
  images: { imageId: number; imageUrl: string }[];
  soldCount: number;
}

export interface OrderSummary {
  orderId: number;
  totalAmount: number;
  platformFee: number;
  sellerAmount: number | null;
  paymentMethod: string;
  shippingFee: number;
  status: string;
  receiverName: string;
  receiverPhone: string;
  shippingAddress: string;
  createdAt: Date;
  buyer: { fullName: string } | null;
  seller?: { storeName: string } | null;
  payments?: { method: string; status: string; amount: number }[];
  shipment?: { status: string; trackingCode: string | null } | null;
  orderItems?: OrderItem[];
}

export interface OrderItem {
  orderItemId: number;
  quantity: number;
  unitPrice: number;
  product: { name: string; images: { imageUrl: string }[] };
}

export interface WithdrawalRequest {
  withdrawalId: number;
  sellerId: number;
  amount: number;
  withdrawalFee: number;
  netPayout: number | null;
  status: string;
  transferReference: string | null;
  failureReason: string | null;
  retryCount: number;
  requestedAt: Date;
  processedAt: Date | null;
  completedAt: Date | null;
  bankAccount: BankAccount;
}
