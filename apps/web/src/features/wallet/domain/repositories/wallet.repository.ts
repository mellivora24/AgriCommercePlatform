import type { TopupRequest, TransactionListResponse, WalletBalance } from '../entities/wallet.entity';

export interface IWalletRepository {
  getBalance(): Promise<WalletBalance>;
  getTransactions(page: number, limit: number): Promise<TransactionListResponse>;
  topup(request: TopupRequest): Promise<WalletBalance>;
}
