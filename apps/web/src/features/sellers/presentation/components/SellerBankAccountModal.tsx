import React, { useState } from "react";
import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import {
  useAddSellerBankAccount,
  useUpdateSellerBankAccount,
} from "@/features/sellers/presentation/hooks/useSeller";
import type { BankAccount } from "@/features/sellers/domain/entities/seller.entity";

interface Props {
  isOpen: boolean;
  bankAccount?: BankAccount;
  onClose: () => void;
}

export const SellerBankAccountModal: React.FC<Props> = ({
  isOpen,
  bankAccount,
  onClose,
}) => {
  const [form, setForm] = useState({
    bankName: bankAccount?.bankName ?? "",
    accountNumber: bankAccount?.accountNumber ?? "",
    accountName: bankAccount?.accountName ?? "",
    isPrimary: bankAccount?.isPrimary ?? false,
  });

  const isEdit = !!bankAccount;

  const { mutate: addBankAccount, isPending: isAdding } = useAddSellerBankAccount();
  const { mutate: updateBankAccount, isPending: isUpdating } = useUpdateSellerBankAccount();

  const isPending = isAdding || isUpdating;

  const handleSubmit = () => {
    if (isEdit) {
      updateBankAccount(
        {
          bankAccountId: bankAccount.bankAccountId,
          data: {
            bankName: form.bankName,
            accountNumber: form.accountNumber,
            accountName: form.accountName,
            isPrimary: form.isPrimary,
          },
        },
        {
          onSuccess: () => onClose(),
        },
      );
    } else {
      addBankAccount(
        {
          bankName: form.bankName,
          accountNumber: form.accountNumber,
          accountName: form.accountName,
          isPrimary: form.isPrimary,
        },
        {
          onSuccess: () => onClose(),
        },
      );
    }
  };

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      title={isEdit ? "Chỉnh sửa tài khoản ngân hàng" : "Thêm tài khoản ngân hàng"}
      size="md"
    >
      <div className="space-y-5 w-full max-w-md">
        <h2 className="text-xl font-bold">
          {isEdit ? "Chỉnh sửa tài khoản ngân hàng" : "Thêm tài khoản ngân hàng"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên ngân hàng
            </label>
            <Input
              value={form.bankName}
              onChange={(e) => setForm((f) => ({ ...f, bankName: e.target.value }))}
              placeholder="Vd: Vietcombank, BIDV..."
              disabled={isPending}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số tài khoản
            </label>
            <Input
              value={form.accountNumber}
              onChange={(e) => setForm((f) => ({ ...f, accountNumber: e.target.value }))}
              placeholder="Số tài khoản"
              disabled={isPending}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên chủ tài khoản
            </label>
            <Input
              value={form.accountName}
              onChange={(e) => setForm((f) => ({ ...f, accountName: e.target.value }))}
              placeholder="Tên chủ tài khoản"
              disabled={isPending}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPrimary"
              checked={form.isPrimary}
              onChange={(e) => setForm((f) => ({ ...f, isPrimary: e.target.checked }))}
              className="w-4 h-4"
              disabled={isPending}
            />
            <label htmlFor="isPrimary" className="text-sm text-gray-700">
              Đặt làm tài khoản mặc định
            </label>
          </div>
        </div>

        <div className="flex gap-3 justify-end border-t pt-4">
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isPending}>
            {isPending
              ? "Đang lưu..."
              : isEdit
                ? "Lưu thay đổi"
                : "Thêm tài khoản"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
