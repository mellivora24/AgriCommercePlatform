export type UserRole = 'ADMIN' | 'BUYER' | 'SELLER' | 'SHIPPER' | 'GUEST';

export type AccountStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'SUSPENDED'
  | 'BANNED'
  | 'DELETED';

export type SellerStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export type ShipperStatus = 'WORKING' | 'ON_LEAVE';

export type AdminRole = 'SUPER_ADMIN' | 'SUPPORT_ADMIN' | 'FINANCE_ADMIN';

export type ProductStatus = 'HIDDEN' | 'AVAILABLE' | 'OUT_OF_STOCK' | 'PENDING';

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'WAITING_SELLER_CONFIRMATION'
  | 'SELLER_CONFIRMED'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'REFUNDED';

export type ShipmentStatus =
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'DELIVERING'
  | 'DELIVERED'
  | 'RETURNING'
  | 'RETURNED';

export type PaymentMethod = 'ONLINE' | 'COD';

export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED'
  | 'WAITING_COD_COLLECTION';

export type WalletBalanceType =
  | 'PENDING'
  | 'AVAILABLE'
  | 'RESERVED'
  | 'WITHDRAWING'
  | 'ON_HOLD';

export type WalletTxnType =
  | 'ORDER_PENDING'
  | 'ORDER_RELEASED'
  | 'ORDER_REFUNDED'
  | 'WITHDRAWAL_REQUESTED'
  | 'WITHDRAWAL_COMPLETED'
  | 'WITHDRAWAL_FAILED'
  | 'WITHDRAWAL_CANCELLED'
  | 'RESERVE_HOLD'
  | 'RESERVE_RELEASE'
  | 'MANUAL_CREDIT'
  | 'MANUAL_DEBIT';

export type WithdrawalStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export type ReturnStatus =
  | 'REQUESTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'RETURNING'
  | 'RECEIVED'
  | 'REFUNDED';

export type PlatformTxnType =
  | 'ESCROW_IN'
  | 'ESCROW_OUT_SELLER'
  | 'ESCROW_OUT_REFUND'
  | 'FEE_EARNED'
  | 'MANUAL_ADJUST';
