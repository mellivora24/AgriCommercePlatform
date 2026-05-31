import type { WalletBalance, TransactionListResponse } from '../../domain/entities/wallet.entity';
import type { WalletBalanceDTO, TransactionListResponseDTO } from '../dtos/wallet.dto';

export const WalletMapper = {
  toBalanceEntity: (dto: WalletBalanceDTO): WalletBalance => ({
    balance: dto.balance,
    pendingAmount: dto.pendingAmount,
    lockedAmount: dto.lockedAmount,
    totalEarnings: dto.totalEarnings,
  }),

  toTransactionListEntity: (dto: TransactionListResponseDTO): TransactionListResponse => ({
    items: dto.items,
    total: dto.total,
    page: dto.page,
    limit: dto.limit,
  }),
};
