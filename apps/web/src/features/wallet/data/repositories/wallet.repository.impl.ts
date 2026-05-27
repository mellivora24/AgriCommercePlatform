import type { TopupRequest, TransactionListResponse, WalletBalance } from '../../domain/entities/wallet.entity';
import type { IWalletRepository } from '../../domain/repositories/wallet.repository';
import { WalletMapper } from '../mappers/wallet.mapper';
import type { WalletApi } from '../api/wallet.api';

export const createWalletRepository = (walletApi: WalletApi): IWalletRepository => ({
  getBalance: async (): Promise<WalletBalance> => {
    const dto = await walletApi.getBalance();
    return WalletMapper.toBalanceEntity(dto);
  },

  getTransactions: async (page: number, limit: number): Promise<TransactionListResponse> => {
    const dto = await walletApi.getTransactions(page, limit);
    return WalletMapper.toTransactionListEntity(dto);
  },

  topup: async (request: TopupRequest): Promise<WalletBalance> => {
    const dto = await walletApi.topup(request);
    return WalletMapper.toBalanceEntity(dto);
  },
});
