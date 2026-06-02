import { useState } from "react";
import BaseModal from "@/features/admin/presentation/components/BaseModal";
import { useRejectWithdrawal } from "@/features/admin/presentation/hooks/useAdmin";
import type { WithdrawalRequest } from "@/features/admin/domain/entities/admin.entity";

interface Props {
  open: boolean;
  withdrawal: WithdrawalRequest | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    n,
  );

export default function WithdrawalRejectModal({
  open,
  withdrawal,
  onClose,
  onSuccess,
}: Props) {
  const [reason, setReason] = useState("");
  const { mutate, isPending } = useRejectWithdrawal();

  const handleClose = () => {
    setReason("");
    onClose();
  };

  const handleConfirm = () => {
    if (!withdrawal) return;
    mutate(
      {
        withdrawalId: withdrawal.withdrawalId,
        body: { reason: reason.trim() || undefined },
      },
      {
        onSuccess: () => {
          handleClose();
          onSuccess?.();
        },
      },
    );
  };

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title="Từ chối yêu cầu rút tiền"
      subtitle={
        withdrawal
          ? `#${withdrawal.withdrawalId} — ${fmt(withdrawal.amount)}`
          : ""
      }
      size="sm"
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {isPending && (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            Từ chối
          </button>
        </div>
      }
    >
      <p className="text-sm text-zinc-500 mb-4">
        Nhập lý do từ chối yêu cầu rút tiền này (không bắt buộc):
      </p>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Ví dụ: Thông tin tài khoản không khớp, nghi ngờ gian lận..."
        rows={4}
        className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-500 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-zinc-400 transition-colors shadow-sm"
      />
    </BaseModal>
  );
}
