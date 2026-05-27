export interface WalletBalance {
  balance: number;
  pendingAmount: number;
  lockedAmount: number;
  totalEarnings: number;
}

export type TransactionType = 'topup' | 'payment' | 'refund' | 'earning';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  status: TransactionStatus;
  createdAt: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  balance: number;
  transaction: Transaction;
}

export interface TransactionListResponse {
  items: WalletTransaction[];
  total: number;
  page: number;
  limit: number;
}

export interface TopupRequest {
  amount: number;
  paymentMethod: string;
}
