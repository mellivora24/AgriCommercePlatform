import type { TopupRequest, TransactionListResponse, WalletBalance } from '../entities/wallet.entity';
import type { IWalletRepository } from '../repositories/wallet.repository';

export interface GetBalanceUseCase {
  execute(): Promise<WalletBalance>;
}

export interface GetTransactionsUseCase {
  execute(page: number, limit: number): Promise<TransactionListResponse>;
}

export interface TopupUseCase {
  execute(request: TopupRequest): Promise<WalletBalance>;
}

export const createGetBalanceUseCase = (repository: IWalletRepository): GetBalanceUseCase => ({
  execute: () => repository.getBalance(),
});

export const createGetTransactionsUseCase = (repository: IWalletRepository): GetTransactionsUseCase => ({
  execute: (page: number, limit: number) => repository.getTransactions(page, limit),
});

export const createTopupUseCase = (repository: IWalletRepository): TopupUseCase => ({
  execute: (request: TopupRequest) => repository.topup(request),
});
