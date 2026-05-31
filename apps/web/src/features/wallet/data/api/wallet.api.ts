import type { AxiosInstance } from 'axios';
import type { TopupRequest } from '../../domain/entities/wallet.entity';
import type { WalletBalanceDTO, TransactionListResponseDTO, TopupRequestDTO } from '../dtos/wallet.dto';

export const createWalletApi = (axiosInstance: AxiosInstance) => ({
  // Get seller wallet
  getWallet: async (): Promise<WalletBalanceDTO> => {
    const { data } = await axiosInstance.get('/wallet');
    return data;
  },

  // Get wallet journals
  getJournals: async (): Promise<any[]> => {
    const { data } = await axiosInstance.get('/wallet/journals');
    return data;
  },

  // Get wallet transactions
  getTransactions: async (): Promise<TransactionListResponseDTO> => {
    const { data } = await axiosInstance.get('/wallet/transactions');
    return data;
  },

  // Get withdrawal requests
  getWithdrawals: async (): Promise<any[]> => {
    const { data } = await axiosInstance.get('/wallet/withdrawals');
    return data;
  },

  // Get specific withdrawal request
  getWithdrawal: async (withdrawalId: number): Promise<any> => {
    const { data } = await axiosInstance.get(`/wallet/withdrawals/${withdrawalId}`);
    return data;
  },

  // Request withdrawal
  requestWithdrawal: async (dto: any): Promise<any> => {
    const { data } = await axiosInstance.post('/wallet/withdraw', dto);
    return data;
  },

  // Confirm withdrawal
  confirmWithdrawal: async (withdrawalId: number, dto: any): Promise<any> => {
    const { data } = await axiosInstance.put(`/wallet/withdrawals/${withdrawalId}/confirm`, dto);
    return data;
  },
});

export type WalletApi = ReturnType<typeof createWalletApi>;
