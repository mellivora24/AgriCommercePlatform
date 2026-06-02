import ConfirmModal from "@/features/admin/presentation/components/ConfirmModal";
import { useApproveWithdrawal } from "@/features/admin/presentation/hooks/useAdmin";
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

export default function WithdrawalApproveModal({
  open,
  withdrawal,
  onClose,
  onSuccess,
}: Props) {
  const { mutate, isPending } = useApproveWithdrawal();

  const handleConfirm = () => {
    if (!withdrawal) return;
    mutate(withdrawal.withdrawalId, {
      onSuccess: () => {
        onClose();
        onSuccess?.();
      },
    });
  };

  return (
    <ConfirmModal
      open={open}
      variant="primary"
      title="Duyệt yêu cầu rút tiền"
      description={
        withdrawal
          ? `Xác nhận duyệt yêu cầu rút ${fmt(withdrawal.amount)}. Thực nhận: ${fmt(withdrawal.netPayout ?? withdrawal.amount)} về tài khoản ${withdrawal.bankAccount.accountNumber} (${withdrawal.bankAccount.bankName}).`
          : ""
      }
      confirmLabel="Duyệt yêu cầu"
      loading={isPending}
      onConfirm={handleConfirm}
      onClose={onClose}
    />
  );
}
