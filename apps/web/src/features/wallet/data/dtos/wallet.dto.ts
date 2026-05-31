import type { WalletBalance, Transaction, WalletTransaction, TransactionListResponse } from '../../domain/entities/wallet.entity';

export interface WalletBalanceDTO extends WalletBalance {}

export interface TransactionDTO extends Transaction {}

export interface WalletTransactionDTO extends WalletTransaction {}

export interface TransactionListResponseDTO extends TransactionListResponse {}

export interface TopupRequestDTO {
  amount: number;
  paymentMethod: string;
}
