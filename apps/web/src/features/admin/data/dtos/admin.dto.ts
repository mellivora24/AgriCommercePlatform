export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface AdminUserListQuery extends PaginationQuery {
  role?: string;
  status?: string;
  search?: string;
}

export interface AdminStoreListQuery extends PaginationQuery {
  status?: string;
  search?: string;
}

export interface AdminStoreProductQuery extends PaginationQuery {
  status?: string;
  search?: string;
}

export interface AdminStoreOrderQuery extends PaginationQuery {
  status?: string;
  search?: string;
}

export interface AdminStoreWithdrawalQuery extends PaginationQuery {
  status?: string;
}

export interface AdminProductListQuery extends PaginationQuery {
  status?: string;
  search?: string;
  categoryId?: number;
}

export interface AdminDashboardDTO {
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
    totalGmv: string;
    totalPlatformFee: string;
    platformWallet: {
      escrowBalance: string;
      revenueBalance: string;
      reserveBalance: string;
    } | null;
  };
  pending: {
    sellerApprovals: number;
    withdrawalsPending: number;
    withdrawalsProcessing: number;
    returnRequests: number;
  };
  recentOrders: AdminOrderSummaryDTO[];
}

export interface AdminUserDTO {
  userId: number;
  email: string;
  nickname: string | null;
  phone: string | null;
  role: string;
  status: string;
  createdAt: string;
  buyerProfile: { fullName: string; avatarUrl: string | null } | null;
  sellerProfile: { sellerId: number; storeName: string; status: string } | null;
  shipperProfile: { shipperId: number; status: string } | null;
  adminProfile: { adminId: number; role: string } | null;
}

export interface AdminUserDetailDTO extends AdminUserDTO {
  buyerProfile: ({
    fullName: string;
    avatarUrl: string | null;
    _count: { orders: number };
  }) | null;
  sellerProfile: ({
    sellerId: number;
    storeName: string;
    status: string;
    wallet: SellerWalletDTO | null;
    _count: { products: number; orders: number };
  }) | null;
  shipperProfile: { shipperId: number; status: string } | null;
  adminProfile: { adminId: number; role: string } | null;
}

export interface SellerWalletDTO {
  pendingBalance: string;
  availableBalance: string;
  reservedBalance: string;
  withdrawingBalance: string;
  onHoldBalance: string;
  lifetimeEarned: string;
  lifetimeWithdrawn: string;
}

export interface AdminStoreDTO {
  sellerId: number;
  storeName: string;
  storeDescription: string | null;
  platformFeeRate: string;
  status: string;
  createdAt: string;
  user: {
    userId: number;
    email: string;
    phone: string | null;
    status: string;
    createdAt: string;
  };
  wallet: SellerWalletDTO | null;
  _count: { products: number; orders: number; withdrawalRequests: number };
  orderStats: {
    totalRevenue: string;
    platformFeeEarned: string;
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
  };
}

export interface AdminStoreDetailDTO extends Omit<AdminStoreDTO, 'orderStats'> {
  bankAccounts: BankAccountDTO[];
  orderSummary: {
    totalRevenue: string;
    platformFeeEarned: string;
    byStatus: { status: string; count: number; revenue: string }[];
  };
}

export interface BankAccountDTO {
  bankAccountId: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isPrimary: boolean;
}

export interface AdminProductDTO {
  productId: number;
  name: string;
  description: string;
  price: string;
  stockQuantity: number | null;
  status: string;
  createdAt: string;
  seller: { sellerId: number; storeName: string };
  category: { categoryId: number; name: string } | null;
  images: { imageId: number; imageUrl: string }[];
  _count: { orderItems: number };
}

export interface AdminOrderSummaryDTO {
  orderId: number;
  totalAmount: string;
  platformFee: string;
  sellerAmount: string | null;
  paymentMethod: string;
  shippingFee: string;
  status: string;
  receiverName: string;
  receiverPhone: string;
  shippingAddress: string;
  createdAt: string;
  buyer: { fullName: string } | null;
  seller?: { storeName: string } | null;
  payments?: { method: string; status: string; amount: string }[];
  shipment?: { status: string; trackingCode: string | null } | null;
  orderItems?: AdminOrderItemDTO[];
}

export interface AdminOrderItemDTO {
  orderItemId: number;
  quantity: number;
  unitPrice: string;
  product: { name: string; images: { imageUrl: string }[] };
}

export interface AdminWithdrawalDTO {
  withdrawalId: number;
  sellerId: number;
  amount: string;
  withdrawalFee: string;
  netPayout: string | null;
  status: string;
  transferReference: string | null;
  failureReason: string | null;
  retryCount: number;
  requestedAt: string;
  processedAt: string | null;
  completedAt: string | null;
  bankAccount: BankAccountDTO;
}

export interface RejectSellerDTO {
  reason?: string;
}

export interface RejectWithdrawalDTO {
  reason?: string;
}

export interface UpdateStoreFeeDTO {
  platformFeeRate: number;
}

export interface SuspendUserDTO {
  reason?: string;
}

export interface BanUserDTO {
  reason?: string;
}

export interface CreateAdminDTO {
  role: 'SUPER_ADMIN' | 'SUPPORT_ADMIN' | 'FINANCE_ADMIN';
}
export interface AdminShipperStatDTO {
  shipperId: number;
  userId: number;
  nickname: string | null;
  phone: string | null;
  userStatus: string;
  shipperStatus: string;
  totalShipments: number;
  deliveredShipments: number;
  activeShipments: number;
  returningShipments: number;
}

export interface AdminShipperLeaderboardQuery extends PaginationQuery {}