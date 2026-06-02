import { useState } from "react";
import BaseModal from "@/features/admin/presentation/components/BaseModal";
import WithdrawalApproveModal from "@/features/admin/presentation/components/stores/WithdrawalApproveModal";
import WithdrawalRejectModal from "@/features/admin/presentation/components/stores/WithdrawalRejectModal";
import type { WithdrawalRequest } from "@/features/admin/domain/entities/admin.entity";

interface Props {
  open: boolean;
  withdrawal: WithdrawalRequest | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const statusLabel: Record<string, { label: string; cls: string }> = {
  PENDING: {
    label: "Chờ duyệt",
    cls: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  PROCESSING: {
    label: "Đang xử lý",
    cls: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  COMPLETED: {
    label: "Hoàn thành",
    cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  FAILED: {
    label: "Thất bại",
    cls: "bg-red-500/15 text-red-400 border-red-500/30",
  },
  CANCELLED: {
    label: "Đã hủy",
    cls: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  },
};

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    n,
  );
const fmtDate = (d: Date) =>
  new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-zinc-200 last:border-0">
      <span className="text-sm text-zinc-500 flex-shrink-0">{label}</span>
      <span className="text-sm text-zinc-800 text-right">{value}</span>
    </div>
  );
}

export default function WithdrawalDetailModal({
  open,
  withdrawal,
  onClose,
  onSuccess,
}: Props) {
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  if (!withdrawal) return null;

  const st = statusLabel[withdrawal.status] ?? {
    label: withdrawal.status,
    cls: "bg-zinc-100 text-zinc-600 border-zinc-200",
  };
  const canAct = withdrawal.status === "PENDING";

  return (
    <>
      <BaseModal
        open={open}
        onClose={onClose}
        title="Chi tiết yêu cầu rút tiền"
        subtitle={`#${withdrawal.withdrawalId}`}
        size="md"
        footer={
          canAct ? (
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setRejectOpen(true)}
                className="px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-colors"
              >
                Từ chối
              </button>
              <button
                onClick={() => setApproveOpen(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                Duyệt yêu cầu
              </button>
            </div>
          ) : null
        }
      >
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${st.cls}`}
            >
              {st.label}
            </span>
            {withdrawal.retryCount > 0 && (
              <span className="text-xs text-zinc-500">
                Đã thử lại {withdrawal.retryCount} lần
              </span>
            )}
          </div>

          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
              Thông tin ngân hàng
            </p>
            <div className="bg-zinc-50 rounded-xl border border-zinc-200 px-4">
              <InfoRow
                label="Ngân hàng"
                value={withdrawal.bankAccount.bankName}
              />
              <InfoRow
                label="Số tài khoản"
                value={
                  <span className="font-mono">
                    {withdrawal.bankAccount.accountNumber}
                  </span>
                }
              />
              <InfoRow
                label="Chủ tài khoản"
                value={withdrawal.bankAccount.accountName}
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
              Tài chính
            </p>
            <div className="bg-zinc-50 rounded-xl border border-zinc-200 px-4">
              <InfoRow
                label="Số tiền yêu cầu"
                value={
                    <span className="font-semibold text-zinc-900">
                    {fmt(withdrawal.amount)}
                  </span>
                }
              />
              <InfoRow
                label="Phí rút tiền"
                value={fmt(withdrawal.withdrawalFee)}
              />
              <InfoRow
                label="Thực nhận"
                value={
                  <span className="font-semibold text-emerald-600">
                    {withdrawal.netPayout != null
                      ? fmt(withdrawal.netPayout)
                      : "—"}
                  </span>
                }
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
              Thời gian
            </p>
            <div className="bg-zinc-50 rounded-xl border border-zinc-200 px-4">
              <InfoRow
                label="Yêu cầu lúc"
                value={fmtDate(withdrawal.requestedAt)}
              />
              {withdrawal.processedAt && (
                <InfoRow
                  label="Xử lý lúc"
                  value={fmtDate(withdrawal.processedAt)}
                />
              )}
              {withdrawal.completedAt && (
                <InfoRow
                  label="Hoàn thành lúc"
                  value={fmtDate(withdrawal.completedAt)}
                />
              )}
            </div>
          </div>

          {withdrawal.transferReference && (
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                Mã tham chiếu
              </p>
              <p className="font-mono text-sm text-zinc-800 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2">
                {withdrawal.transferReference}
              </p>
            </div>
          )}

          {withdrawal.failureReason && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs font-medium text-red-400 mb-0.5">
                Lý do thất bại
              </p>
              <p className="text-sm text-zinc-600">
                {withdrawal.failureReason}
              </p>
            </div>
          )}
        </div>
      </BaseModal>

      <WithdrawalApproveModal
        open={approveOpen}
        withdrawal={withdrawal}
        onClose={() => setApproveOpen(false)}
        onSuccess={() => {
          setApproveOpen(false);
          onClose();
          onSuccess?.();
        }}
      />
      <WithdrawalRejectModal
        open={rejectOpen}
        withdrawal={withdrawal}
        onClose={() => setRejectOpen(false)}
        onSuccess={() => {
          setRejectOpen(false);
          onClose();
          onSuccess?.();
        }}
      />
    </>
  );
}
