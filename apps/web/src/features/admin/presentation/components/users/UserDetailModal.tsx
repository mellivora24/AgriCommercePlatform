import { useState } from 'react';
import BaseModal from '@/features/admin/presentation/components/BaseModal';
import SuspendUserModal from '@/features/admin/presentation/components/users/SuspendUserModal';
import BanUserModal from '@/features/admin/presentation/components/users/BanUserModal';
import DeleteUserModal from '@/features/admin/presentation/components/users/DeleteUserModal';
import { useAdminUserDetail } from '@/features/admin/presentation/hooks/useAdmin';

interface Props {
  open: boolean;
  userId: number | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const roleLabel: Record<string, string> = {
  ADMIN: 'Admin', BUYER: 'Người mua', SELLER: 'Người bán', SHIPPER: 'Shipper', GUEST: 'Khách',
};

const accountStatusLabel: Record<string, { label: string; cls: string }> = {
  ACTIVE:    { label: 'Hoạt động',   cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  INACTIVE:  { label: 'Không hoạt động', cls: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30' },
  SUSPENDED: { label: 'Đình chỉ',    cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  BANNED:    { label: 'Đã cấm',      cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
  DELETED:   { label: 'Đã xóa',      cls: 'bg-zinc-100 text-zinc-500 border-zinc-200' },
};

const sellerStatusLabel: Record<string, { label: string; cls: string }> = {
  PENDING:   { label: 'Chờ duyệt',  cls: 'text-amber-400' },
  APPROVED:  { label: 'Đã duyệt',   cls: 'text-emerald-400' },
  REJECTED:  { label: 'Từ chối',    cls: 'text-red-400' },
  SUSPENDED: { label: 'Đình chỉ',   cls: 'text-amber-500' },
};

const fmt = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-zinc-200 last:border-0">
      <span className="text-sm text-zinc-500 flex-shrink-0">{label}</span>
      <span className="text-sm text-zinc-800 text-right">{value}</span>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-center">
      <p className="text-xl font-bold text-zinc-900">{value}</p>
      <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
    </div>
  );
}

export default function UserDetailModal({ open, userId, onClose, onSuccess }: Props) {
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [banOpen, setBanOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: user, isLoading } = useAdminUserDetail(userId ?? 0);

  const handleSuccess = () => { onClose(); onSuccess?.(); };

  const st = user ? (accountStatusLabel[user.status] ?? { label: user.status, cls: 'bg-zinc-100 text-zinc-600 border-zinc-200' }) : null;
  const canAct = user && !['DELETED', 'BANNED'].includes(user.status);

  return (
    <>
      <BaseModal
        open={open}
        onClose={onClose}
        title="Chi tiết người dùng"
        subtitle={userId ? `#${userId}` : ''}
        size="lg"
        footer={
          user && (
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                {canAct && user.status !== 'SUSPENDED' && (
                  <button
                    onClick={() => setSuspendOpen(true)}
                    className="px-3 py-1.5 text-sm font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors"
                  >
                    Đình chỉ
                  </button>
                )}
                {canAct && (
                  <button
                    onClick={() => setBanOpen(true)}
                    className="px-3 py-1.5 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-colors"
                  >
                    Cấm tài khoản
                  </button>
                )}
                {user.status !== 'DELETED' && (
                  <button
                    onClick={() => setDeleteOpen(true)}
                    className="px-3 py-1.5 text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-zinc-600 hover:border-red-500/30 rounded-lg transition-colors"
                  >
                    Xóa tài khoản
                  </button>
                )}
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          )
        }
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <svg className="w-8 h-8 animate-spin text-zinc-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : !user ? (
          <p className="text-sm text-zinc-500 text-center py-10">Không tìm thấy người dùng</p>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                {user.buyerProfile?.avatarUrl ? (
                  <img src={user.buyerProfile.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-xl font-bold text-zinc-600">
                    {(user.buyerProfile?.fullName ?? user.email)[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="text-base font-semibold text-zinc-900">
                  {user.buyerProfile?.fullName ?? user.nickname ?? user.email}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-zinc-500">{roleLabel[user.role] ?? user.role}</span>
                  {st && (
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${st.cls}`}>
                      {st.label}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-zinc-50 rounded-xl border border-zinc-200 px-4">
              <InfoRow label="Email" value={user.email} />
              {user.phone && <InfoRow label="Số điện thoại" value={user.phone} />}
              {user.nickname && <InfoRow label="Nickname" value={user.nickname} />}
              <InfoRow
                label="Ngày tham gia"
                value={new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long' }).format(user.createdAt)}
              />
            </div>

            {user.buyerProfile?.orderCount != null && (
              <div>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Hoạt động mua hàng</p>
                <div className="grid grid-cols-1 gap-3">
                  <StatCard label="Đơn hàng" value={user.buyerProfile.orderCount} />
                </div>
              </div>
            )}

            {user.sellerProfile && (
              <div>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Thông tin cửa hàng</p>
                <div className="bg-zinc-50 rounded-xl border border-zinc-200 px-4 mb-3">
                  <InfoRow label="Tên cửa hàng" value={user.sellerProfile.storeName} />
                  <InfoRow
                    label="Trạng thái"
                    value={
                      <span className={sellerStatusLabel[user.sellerProfile.status]?.cls ?? 'text-zinc-700'}>
                        {sellerStatusLabel[user.sellerProfile.status]?.label ?? user.sellerProfile.status}
                      </span>
                    }
                  />
                  {user.sellerProfile.productCount != null && (
                    <InfoRow label="Sản phẩm" value={user.sellerProfile.productCount} />
                  )}
                  {user.sellerProfile.orderCount != null && (
                    <InfoRow label="Đơn hàng" value={user.sellerProfile.orderCount} />
                  )}
                </div>
                {user.sellerProfile.wallet && (
                  <div className="grid grid-cols-2 gap-2">
                    <StatCard label="Số dư khả dụng" value={fmt(user.sellerProfile.wallet.availableBalance)} />
                    <StatCard label="Tổng thu nhập" value={fmt(user.sellerProfile.wallet.lifetimeEarned)} />
                  </div>
                )}
              </div>
            )}

            {user.adminProfile && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                <p className="text-xs font-medium text-indigo-600 mb-0.5">Quyền Admin</p>
                <p className="text-sm text-zinc-700">{user.adminProfile.role}</p>
              </div>
            )}
          </div>
        )}
      </BaseModal>

      <SuspendUserModal
        open={suspendOpen}
        user={user ?? null}
        onClose={() => setSuspendOpen(false)}
        onSuccess={handleSuccess}
      />
      <BanUserModal
        open={banOpen}
        user={user ?? null}
        onClose={() => setBanOpen(false)}
        onSuccess={handleSuccess}
      />
      <DeleteUserModal
        open={deleteOpen}
        user={user ?? null}
        onClose={() => setDeleteOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
