import React, { useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { formatCurrency } from "@/shared/utils/format";
import { useSellerWithdraw } from "@/features/sellers/presentation/hooks/useSeller";
import type { BankAccount } from "@/features/sellers/domain/entities/seller.entity";

interface SellerWithdrawModalProps {
  isOpen: boolean;
  availableBalance: number;
  bankAccounts: BankAccount[];
  defaultBankAccount?: BankAccount;
  onClose: () => void;
}

export const SellerWithdrawModal: React.FC<SellerWithdrawModalProps> = ({
  isOpen,
  availableBalance,
  bankAccounts,
  defaultBankAccount,
  onClose,
}) => {
  const [amount, setAmount] = useState("");
  const [selectedBankAccountId, setSelectedBankAccountId] = useState<string>(
    String(defaultBankAccount?.bankAccountId ?? ""),
  );
  const [error, setError] = useState<string | null>(null);

  const { mutate: withdraw, isPending } = useSellerWithdraw();

  if (!isOpen) return null;

  const numericAmount = parseFloat(amount.replace(/\./g, "").replace(/,/g, "")) || 0;
  const isAmountValid = numericAmount >= 10_000 && numericAmount <= availableBalance;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setAmount(raw ? Number(raw).toLocaleString("vi-VN") : "");
    setError(null);
  };

  const handleSetMax = () => {
    setAmount(availableBalance.toLocaleString("vi-VN"));
    setError(null);
  };

  const handleSubmit = () => {
    if (!isAmountValid) {
      setError(
        numericAmount < 10_000
          ? "Số tiền rút tối thiểu là 10.000₫"
          : "Số tiền vượt quá số dư khả dụng",
      );
      return;
    }
    if (!selectedBankAccountId) {
      setError("Vui lòng chọn tài khoản ngân hàng");
      return;
    }

    withdraw(
      {
        amount: numericAmount,
        bankAccountId: Number(selectedBankAccountId),
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: () => {
          setError("Yêu cầu rút tiền thất bại. Vui lòng thử lại.");
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Rút tiền</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
            aria-label="Đóng"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Available balance */}
          <div className="bg-green-50 rounded-lg px-4 py-3 flex justify-between items-center">
            <span className="text-sm text-gray-600">Số dư khả dụng</span>
            <span className="font-bold text-green-700 text-lg">
              {formatCurrency(availableBalance)}
            </span>
          </div>

          {/* Amount input */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Số tiền muốn rút
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0"
                className="w-full border rounded-lg px-4 py-2.5 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-10 text-gray-400 text-sm select-none">
                ₫
              </span>
              <button
                type="button"
                onClick={handleSetMax}
                className="absolute right-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Tối đa
              </button>
            </div>
            <p className="text-xs text-gray-400">Tối thiểu 10.000₫</p>
          </div>

          {/* Bank account selection */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Tài khoản nhận tiền
            </label>
            <select
              value={selectedBankAccountId}
              onChange={(e) => {
                setSelectedBankAccountId(e.target.value);
                setError(null);
              }}
              className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="" disabled>
                Chọn tài khoản ngân hàng
              </option>
              {bankAccounts.map((account) => (
                <option
                  key={account.bankAccountId}
                  value={account.bankAccountId}
                >
                  {account.bankName} — {account.accountNumber}{" "}
                  {account.isPrimary ? "(Mặc định)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t bg-gray-50">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleSubmit}
            disabled={isPending || !amount}
          >
            {isPending ? "Đang xử lý..." : "Gửi yêu cầu rút tiền"}
          </Button>
        </div>
      </div>
    </div>
  );
};
