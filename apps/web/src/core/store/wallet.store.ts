import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletState {
  balance: number;
  pendingAmount: number;
  setBalance: (balance: number) => void;
  setPendingAmount: (amount: number) => void;
  addBalance: (amount: number) => void;
  deductBalance: (amount: number) => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      balance: 0,
      pendingAmount: 0,

      setBalance: (balance) => set({ balance }),

      setPendingAmount: (amount) => set({ pendingAmount: amount }),

      addBalance: (amount) =>
        set((state) => ({
          balance: state.balance + amount,
        })),

      deductBalance: (amount) =>
        set((state) => ({
          balance: Math.max(0, state.balance - amount),
        })),
    }),
    {
      name: 'wallet-store',
    },
  ),
);
