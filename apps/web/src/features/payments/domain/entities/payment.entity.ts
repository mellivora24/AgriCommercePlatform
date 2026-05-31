export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'bank_transfer' | 'wallet';

export interface PaymentTransaction {
  id: string;
  orderId: string;
  transactionId: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentVerification {
  status: PaymentStatus;
  transactionId: string;
  timestamp: string;
}

export interface CreatePaymentRequest {
  orderId: string;
  method: PaymentMethod;
  amount: number;
}
