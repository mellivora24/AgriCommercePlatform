import { useState } from 'react';
import BaseModal from '@/features/admin/presentation/components/BaseModal';
import { useDeleteUser } from '@/features/admin/presentation/hooks/useAdmin';
import type { AdminUser } from '@/features/admin/domain/entities/admin.entity';

interface Props {
  open: boolean;
  user: AdminUser | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function DeleteUserModal({ open, user, onClose, onSuccess }: Props) {
  const [inputValue, setInputValue] = useState('');
  const { mutate, isPending } = useDeleteUser();

  const displayName = user?.buyerProfile?.fullName ?? user?.nickname ?? user?.email ?? '';
  const confirmPhrase = 'XÓA TÀI KHOẢN';
  const isMatch = inputValue.trim() === confirmPhrase;

  const handleClose = () => { setInputValue(''); onClose(); };

  const handleConfirm = () => {
    if (!user || !isMatch) return;
    mutate(user.userId, {
      onSuccess: () => { handleClose(); onSuccess?.(); },
    });
  };

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title="Xóa tài khoản"
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
            disabled={isPending || !isMatch}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            Xóa tài khoản
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <p className="text-sm text-zinc-500">
            Tài khoản <span className="font-medium">"{displayName}"</span> sẽ bị xóa (soft delete). Người dùng sẽ không thể đăng nhập.
          </p>
        </div>

        <div>
          <label className="block text-sm text-zinc-600 mb-1.5">
            Nhập <span className="font-mono text-zinc-900">{confirmPhrase}</span> để xác nhận:
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={confirmPhrase}
            className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-500 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-red-500 transition-colors shadow-sm"
          />
        </div>
      </div>
    </BaseModal>
  );
}
