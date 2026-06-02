import { useState } from 'react';
import BaseModal from '@/features/admin/presentation/components/BaseModal';
import { useSuspendUser } from '@/features/admin/presentation/hooks/useAdmin';
import type { AdminUser } from '@/features/admin/domain/entities/admin.entity';

interface Props {
  open: boolean;
  user: AdminUser | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function SuspendUserModal({ open, user, onClose, onSuccess }: Props) {
  const [reason, setReason] = useState('');
  const { mutate, isPending } = useSuspendUser();

  const handleClose = () => { setReason(''); onClose(); };

  const handleConfirm = () => {
    if (!user) return;
    mutate(
      { userId: user.userId, body: { reason: reason.trim() || undefined } },
      { onSuccess: () => { handleClose(); onSuccess?.(); } },
    );
  };

  const displayName = user?.buyerProfile?.fullName ?? user?.nickname ?? user?.email ?? '';

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title="Đình chỉ tài khoản"
      subtitle={displayName}
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
            className="px-4 py-2 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {isPending && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            Đình chỉ
          </button>
        </div>
      }
    >
      <p className="text-sm text-zinc-500 mb-4">
        Tài khoản <span className="text-zinc-900 font-medium">"{displayName}"</span> sẽ bị đình chỉ tạm thời. Nhập lý do (không bắt buộc):
      </p>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Ví dụ: Vi phạm chính sách, hành vi gian lận..."
        rows={3}
        className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-500 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-zinc-400 transition-colors shadow-sm"
      />
    </BaseModal>
  );
}
