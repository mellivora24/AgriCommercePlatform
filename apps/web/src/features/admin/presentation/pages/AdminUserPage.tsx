import { useState } from 'react';
import { useAdminUsers } from '@/features/admin/presentation/hooks/useAdmin';
import UserDetailModal from '@/features/admin/presentation/components/users/UserDetailModal';
import type { AdminUser } from '@/features/admin/domain/entities/admin.entity';
import type { AdminUserListQuery } from '@/features/admin/data/dtos/admin.dto';

const fmtDate = (d: Date) =>
  new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short' }).format(d);

const roleLabel: Record<string, string> = {
  ADMIN: 'Admin',
  BUYER: 'Người mua',
  SELLER: 'Người bán',
  SHIPPER: 'Shipper',
  GUEST: 'Khách',
};

const accountStatusCfg: Record<string, { label: string; cls: string }> = {
  ACTIVE:    { label: 'Hoạt động',       cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  INACTIVE:  { label: 'Không HĐ',        cls: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30' },
  SUSPENDED: { label: 'Đình chỉ',        cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  BANNED:    { label: 'Đã cấm',          cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
  DELETED:   { label: 'Đã xóa',          cls: 'bg-zinc-700/50 text-zinc-500 border-zinc-600/30' },
};

export default function AdminUserPage() {
  const [query, setQuery] = useState<AdminUserListQuery>({ page: 1, limit: 20 });
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const { data, isLoading, refetch } = useAdminUsers({
    ...query,
    search: search || undefined,
  });

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Quản lý người dùng</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {data ? `${data.meta.total.toLocaleString('vi-VN')} người dùng` : ''}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setQuery((q) => ({ ...q, page: 1 })); }}
            placeholder="Tìm email, tên, số điện thoại..."
            className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-500 rounded-xl px-3 py-2.5 pl-9 text-sm focus:outline-none focus:border-zinc-400 transition-colors shadow-sm"
          />
        </div>
        <select
          onChange={(e) => setQuery((q) => ({ ...q, role: (e.target.value as any) || undefined, page: 1 }))}
          className="bg-white border border-zinc-200 text-zinc-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-zinc-400 shadow-sm"
        >
          <option value="">Tất cả vai trò</option>
          {Object.entries(roleLabel).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select
          onChange={(e) => setQuery((q) => ({ ...q, status: (e.target.value as any) || undefined, page: 1 }))}
          className="bg-white border border-zinc-200 text-zinc-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-zinc-400 shadow-sm"
        >
          <option value="">Tất cả trạng thái</option>
          {Object.entries(accountStatusCfg).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <select
          onChange={(e) => setQuery((q) => ({ ...q, limit: Number(e.target.value), page: 1 }))}
          className="bg-white border border-zinc-200 text-zinc-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-zinc-400 shadow-sm"
        >
          <option value={20}>20 / trang</option>
          <option value={50}>50 / trang</option>
          <option value={100}>100 / trang</option>
        </select>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Người dùng</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Vai trò</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Số điện thoại</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Trạng thái</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Ngày tham gia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-zinc-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data?.data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-zinc-500 text-sm">
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              ) : (
                data?.data.map((user) => {
                  const st = accountStatusCfg[user.status];
                  const displayName = user.buyerProfile?.fullName ?? user.nickname ?? user.email;
                  return (
                    <tr
                      key={user.userId}
                      onClick={() => setSelectedUser(user)}
                      className="hover:bg-zinc-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {user.buyerProfile?.avatarUrl ? (
                              <img src={user.buyerProfile.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-sm font-bold text-zinc-600">
                                {displayName[0]?.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-zinc-900 truncate max-w-[200px]">{displayName}</p>
                            <p className="text-xs text-zinc-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-zinc-700">{roleLabel[user.role] ?? user.role}</span>
                        {user.sellerProfile && (
                          <p className="text-xs text-zinc-500 truncate max-w-[120px]">{user.sellerProfile.storeName}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-zinc-600">{user.phone ?? '—'}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${st?.cls ?? 'bg-zinc-100 text-zinc-700 border-zinc-200'}`}>
                          {st?.label ?? user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-zinc-500">{fmtDate(user.createdAt)}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {data && data.meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-200 bg-zinc-50">
            <p className="text-xs text-zinc-500">
              Trang {data.meta.page} / {data.meta.totalPages} · {data.meta.total.toLocaleString('vi-VN')} người dùng
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setQuery((q) => ({ ...q, page: (q.page ?? 1) - 1 }))}
                disabled={(query.page ?? 1) === 1}
                className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg disabled:opacity-30 transition-colors"
              >
                ← Trước
              </button>
              {Array.from({ length: Math.min(data.meta.totalPages, 5) }).map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setQuery((q) => ({ ...q, page: p }))}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                      (query.page ?? 1) === p
                        ? 'bg-indigo-600 text-white'
                        : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setQuery((q) => ({ ...q, page: (q.page ?? 1) + 1 }))}
                disabled={(query.page ?? 1) === data.meta.totalPages}
                className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg disabled:opacity-30 transition-colors"
              >
                Sau →
              </button>
            </div>
          </div>
        )}
      </div>

      <UserDetailModal
        open={!!selectedUser}
        userId={selectedUser?.userId ?? null}
        onClose={() => setSelectedUser(null)}
        onSuccess={() => {
          setSelectedUser(null);
          refetch();
        }}
      />
    </div>
  );
}
