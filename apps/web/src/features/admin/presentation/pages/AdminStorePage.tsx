import { useState } from 'react';
import { useAdminStores, useAdminStoreDetail, useAdminStoreProducts, useAdminStoreOrders, useAdminStoreWithdrawals } from '@/features/admin/presentation/hooks/useAdmin';
import SellerApproveModal from '@/features/admin/presentation/components/stores/SellerApproveModal';
import SellerRejectModal from '@/features/admin/presentation/components/stores/SellerRejectModal';
import SellerSuspendModal from '@/features/admin/presentation/components/stores/SellerSuspendModal';
import UpdateStoreFeeModal from '@/features/admin/presentation/components/stores/UpdateStoreFeeModal';
import WithdrawalDetailModal from '@/features/admin/presentation/components/stores/WithdrawalDetailModal';
import type { Store, WithdrawalRequest } from '@/features/admin/domain/entities/admin.entity';
import type { AdminStoreListQuery, AdminStoreProductQuery, AdminStoreOrderQuery, AdminStoreWithdrawalQuery } from '@/features/admin/data/dtos/admin.dto';

const fmt = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const fmtDate = (d: Date) =>
  new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short' }).format(d);

const sellerStatusCfg: Record<string, { label: string; cls: string }> = {
  PENDING:   { label: 'Chờ duyệt', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  APPROVED:  { label: 'Đã duyệt',  cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  REJECTED:  { label: 'Từ chối',   cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
  SUSPENDED: { label: 'Đình chỉ',  cls: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30' },
};

const productStatusCfg: Record<string, { label: string; cls: string }> = {
  AVAILABLE:    { label: 'Đang bán',  cls: 'bg-emerald-500/15 text-emerald-400' },
  HIDDEN:       { label: 'Đã ẩn',    cls: 'bg-zinc-500/15 text-zinc-400' },
  OUT_OF_STOCK: { label: 'Hết hàng', cls: 'bg-amber-500/15 text-amber-400' },
  PENDING:      { label: 'Chờ duyệt',cls: 'bg-blue-500/15 text-blue-400' },
};

const orderStatusCfg: Record<string, { label: string; cls: string }> = {
  PENDING_PAYMENT:             { label: 'Chờ TT',       cls: 'bg-zinc-100 text-zinc-700' },
  PAID:                        { label: 'Đã TT',        cls: 'bg-blue-500/20 text-blue-400' },
  WAITING_SELLER_CONFIRMATION: { label: 'Chờ xác nhận', cls: 'bg-amber-500/20 text-amber-400' },
  SELLER_CONFIRMED:            { label: 'Đã xác nhận',  cls: 'bg-blue-500/20 text-blue-400' },
  SHIPPING:                    { label: 'Đang giao',    cls: 'bg-indigo-500/20 text-indigo-400' },
  DELIVERED:                   { label: 'Đã giao',      cls: 'bg-teal-500/20 text-teal-400' },
  COMPLETED:                   { label: 'Hoàn thành',   cls: 'bg-emerald-500/20 text-emerald-400' },
  CANCELLED:                   { label: 'Đã hủy',       cls: 'bg-red-500/20 text-red-400' },
  RETURN_REQUESTED:            { label: 'Yêu cầu hoàn', cls: 'bg-orange-500/20 text-orange-400' },
  REFUNDED:                    { label: 'Hoàn tiền',    cls: 'bg-purple-500/20 text-purple-400' },
};

const withdrawalStatusCfg: Record<string, { label: string; cls: string }> = {
  PENDING:    { label: 'Chờ duyệt',   cls: 'bg-amber-500/15 text-amber-400' },
  PROCESSING: { label: 'Đang xử lý',  cls: 'bg-blue-500/15 text-blue-400' },
  COMPLETED:  { label: 'Hoàn thành',  cls: 'bg-emerald-500/15 text-emerald-400' },
  FAILED:     { label: 'Thất bại',    cls: 'bg-red-500/15 text-red-400' },
  CANCELLED:  { label: 'Đã hủy',      cls: 'bg-zinc-500/15 text-zinc-400' },
};

type Tab = 'overview' | 'products' | 'orders' | 'withdrawals' | 'settings';

function Pagination({ meta, page, onChange }: { meta: { totalPages: number; total: number }; page: number; onChange: (p: number) => void }) {
  if (meta.totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
      <p className="text-xs text-zinc-500">{meta.total.toLocaleString('vi-VN')} kết quả</p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg disabled:opacity-30 transition-colors"
        >
          ← Trước
        </button>
        <span className="px-3 py-1.5 text-xs text-zinc-400">{page} / {meta.totalPages}</span>
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === meta.totalPages}
          className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg disabled:opacity-30 transition-colors"
        >
          Sau →
        </button>
      </div>
    </div>
  );
}

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Tìm kiếm...'}
        className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-500 rounded-xl px-3 py-2 pl-9 text-sm focus:outline-none focus:border-zinc-400 transition-colors shadow-sm"
      />
    </div>
  );
}

function StoreDetailPanel({ store, onAction }: {
  store: Store;
  onAction: (type: 'approve' | 'reject' | 'suspend' | 'fee') => void;
}) {
  const [tab, setTab] = useState<Tab>('overview');
  const [productQuery, setProductQuery] = useState<AdminStoreProductQuery>({ page: 1, limit: 10 });
  const [productSearch, setProductSearch] = useState('');
  const [orderQuery, setOrderQuery] = useState<AdminStoreOrderQuery>({ page: 1, limit: 10 });
  const [orderSearch, setOrderSearch] = useState('');
  const [withdrawalQuery, setWithdrawalQuery] = useState<AdminStoreWithdrawalQuery>({ page: 1, limit: 10 });
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null);

  const { data: detail } = useAdminStoreDetail(store.sellerId);
  const { data: products } = useAdminStoreProducts(store.sellerId, tab === 'products' ? { ...productQuery, search: productSearch || undefined } : undefined);
  const { data: orders } = useAdminStoreOrders(store.sellerId, tab === 'orders' ? { ...orderQuery, search: orderSearch || undefined } : undefined);
  const { data: withdrawals } = useAdminStoreWithdrawals(store.sellerId, tab === 'withdrawals' ? withdrawalQuery : undefined);

  const st = sellerStatusCfg[store.status];
  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Tổng quan' },
    { key: 'products', label: 'Sản phẩm' },
    { key: 'orders', label: 'Đơn hàng' },
    { key: 'withdrawals', label: 'Rút tiền' },
    { key: 'settings', label: 'Cài đặt' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 px-6 pt-6 pb-0 border-b border-zinc-200 bg-white">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${st.cls}`}>{st.label}</span>
            </div>
            <h2 className="text-base font-bold text-zinc-900">{store.storeName}</h2>
            <p className="text-xs text-zinc-500 mt-0.5">{store.user.email}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {store.status === 'PENDING' && (
              <>
                <button onClick={() => onAction('approve')} className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">Duyệt</button>
                <button onClick={() => onAction('reject')} className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-colors">Từ chối</button>
              </>
            )}
            {store.status === 'APPROVED' && (
              <button onClick={() => onAction('suspend')} className="px-3 py-1.5 text-xs font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors">Đình chỉ</button>
            )}
          </div>
        </div>
        <div className="flex gap-0 -mb-px">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {tab === 'overview' && detail && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Tổng doanh thu', value: fmt(detail.orderSummary.totalRevenue), highlight: true },
                { label: 'Phí nền tảng thu', value: fmt(detail.orderSummary.platformFeeEarned) },
                { label: 'Số dư khả dụng', value: fmt(detail.wallet?.availableBalance ?? 0) },
                { label: 'Tổng thu nhập', value: fmt(detail.wallet?.lifetimeEarned ?? 0) },
              ].map((item) => (
                <div key={item.label} className={`rounded-xl border p-4 ${item.highlight ? 'bg-indigo-50 border-indigo-200' : 'bg-zinc-50 border-zinc-200'}`}>
                  <p className="text-xs text-zinc-500 mb-1">{item.label}</p>
                  <p className={`text-base font-bold ${item.highlight ? 'text-indigo-700' : 'text-zinc-900'}`}>{item.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4">
              <p className="text-xs font-medium text-zinc-500 mb-3">Đơn hàng theo trạng thái</p>
              <div className="space-y-2">
                {detail.orderSummary.byStatus.map((s) => {
                  const cfg = orderStatusCfg[s.status];
                  return (
                    <div key={s.status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex px-2 py-0.5 text-xs rounded-full ${cfg?.cls ?? 'bg-zinc-100 text-zinc-700'}`}>{cfg?.label ?? s.status}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-500">{s.count} đơn</span>
                        <span className="text-xs text-zinc-500">{fmt(s.revenue)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {detail.bankAccounts.length > 0 && (
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-2">Tài khoản ngân hàng</p>
                <div className="space-y-2">
                  {detail.bankAccounts.map((acc) => (
                    <div key={acc.bankAccountId} className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-zinc-900">{acc.bankName}</p>
                        <p className="text-xs text-zinc-500 font-mono">{acc.accountNumber} · {acc.accountName}</p>
                      </div>
                      {acc.isPrimary && <span className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">Chính</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'products' && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <SearchInput value={productSearch} onChange={(v) => { setProductSearch(v); setProductQuery((q) => ({ ...q, page: 1 })); }} placeholder="Tìm sản phẩm..." />
              </div>
              <select
                onChange={(e) => setProductQuery((q) => ({ ...q, status: e.target.value as any || undefined, page: 1 }))}
                className="bg-white border border-zinc-200 text-zinc-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-zinc-400 shadow-sm"
              >
                <option value="">Tất cả trạng thái</option>
                {Object.entries(productStatusCfg).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            {products ? (
              <>
                <div className="space-y-2">
                  {products.data.map((p) => {
                    const pst = productStatusCfg[p.status];
                    return (
                      <div key={p.productId} className="flex items-center gap-4 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-100 overflow-hidden flex-shrink-0">
                          {p.images[0] ? <img src={p.images[0].imageUrl} alt="" className="w-full h-full object-cover" /> : null}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-900 truncate">{p.name}</p>
                          <p className="text-xs text-zinc-500">{p.category?.name ?? 'Không có danh mục'} · Đã bán: {p.soldCount}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-semibold text-zinc-900">{fmt(p.price)}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${pst?.cls ?? 'bg-zinc-100 text-zinc-700'}`}>{pst?.label ?? p.status}</span>
                        </div>
                      </div>
                    );
                  })}
                  {products.data.length === 0 && <p className="text-sm text-zinc-500 text-center py-8">Không có sản phẩm</p>}
                </div>
                <Pagination meta={products.meta} page={productQuery.page ?? 1} onChange={(p) => setProductQuery((q) => ({ ...q, page: p }))} />
              </>
            ) : <div className="h-32 flex items-center justify-center"><div className="w-6 h-6 border-2 border-zinc-600 border-t-indigo-500 rounded-full animate-spin" /></div>}
          </div>
        )}

        {tab === 'orders' && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <SearchInput value={orderSearch} onChange={(v) => { setOrderSearch(v); setOrderQuery((q) => ({ ...q, page: 1 })); }} placeholder="Tìm theo tên, SĐT..." />
              </div>
              <select
                onChange={(e) => setOrderQuery((q) => ({ ...q, status: e.target.value as any || undefined, page: 1 }))}
                className="bg-white border border-zinc-200 text-zinc-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-zinc-400 shadow-sm"
              >
                <option value="">Tất cả trạng thái</option>
                {Object.entries(orderStatusCfg).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            {orders ? (
              <>
                <div className="space-y-2">
                  {orders.data.map((o) => {
                    const ost = orderStatusCfg[o.status];
                    return (
                      <div key={o.orderId} className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-zinc-900">#{o.orderId}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${ost?.cls ?? 'bg-zinc-100 text-zinc-700'}`}>{ost?.label ?? o.status}</span>
                            </div>
                            <p className="text-xs text-zinc-500 mt-0.5">{o.receiverName} · {o.receiverPhone}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-zinc-900">{fmt(o.totalAmount)}</p>
                            <p className="text-xs text-zinc-500">{fmtDate(o.createdAt)}</p>
                          </div>
                        </div>
                        {(o.orderItems?.length ?? 0) > 0 && (
                          <p className="text-xs text-zinc-600 mt-1.5">
                            {o.orderItems![0].product.name}{o.orderItems!.length > 1 ? ` +${o.orderItems!.length - 1} sản phẩm` : ''}
                          </p>
                        )}
                      </div>
                    );
                  })}
                  {orders.data.length === 0 && <p className="text-sm text-zinc-500 text-center py-8">Không có đơn hàng</p>}
                </div>
                <Pagination meta={orders.meta} page={orderQuery.page ?? 1} onChange={(p) => setOrderQuery((q) => ({ ...q, page: p }))} />
              </>
            ) : <div className="h-32 flex items-center justify-center"><div className="w-6 h-6 border-2 border-zinc-600 border-t-indigo-500 rounded-full animate-spin" /></div>}
          </div>
        )}

        {tab === 'withdrawals' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <select
                onChange={(e) => setWithdrawalQuery((q) => ({ ...q, status: e.target.value as any || undefined, page: 1 }))}
                className="bg-white border border-zinc-200 text-zinc-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-zinc-400 shadow-sm"
              >
                <option value="">Tất cả trạng thái</option>
                {Object.entries(withdrawalStatusCfg).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            {withdrawals ? (
              <>
                <div className="space-y-2">
                  {withdrawals.data.map((w) => {
                    const wst = withdrawalStatusCfg[w.status];
                    return (
                      <button
                        key={w.withdrawalId}
                        onClick={() => setSelectedWithdrawal(w)}
                        className="w-full text-left bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-zinc-900">#{w.withdrawalId}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${wst?.cls ?? 'bg-zinc-100 text-zinc-700'}`}>{wst?.label ?? w.status}</span>
                            </div>
                            <p className="text-xs text-zinc-500 mt-0.5">{w.bankAccount.bankName} · {w.bankAccount.accountNumber}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-zinc-900">{fmt(w.amount)}</p>
                            <p className="text-xs text-zinc-500">Thực nhận: {fmt(w.netPayout ?? w.amount)}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  {withdrawals.data.length === 0 && <p className="text-sm text-zinc-500 text-center py-8">Không có yêu cầu rút tiền</p>}
                </div>
                <Pagination meta={withdrawals.meta} page={withdrawalQuery.page ?? 1} onChange={(p) => setWithdrawalQuery((q) => ({ ...q, page: p }))} />
              </>
            ) : <div className="h-32 flex items-center justify-center"><div className="w-6 h-6 border-2 border-zinc-600 border-t-indigo-500 rounded-full animate-spin" /></div>}
          </div>
        )}

        {tab === 'settings' && (
          <div className="space-y-4">
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-900">Phí nền tảng</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Áp dụng cho các đơn hàng mới của cửa hàng</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-zinc-900">{store.platformFeeRate}%</span>
                  <button
                    onClick={() => onAction('fee')}
                    className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
                  >
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <WithdrawalDetailModal
        open={!!selectedWithdrawal}
        withdrawal={selectedWithdrawal}
        onClose={() => setSelectedWithdrawal(null)}
        onSuccess={() => setSelectedWithdrawal(null)}
      />
    </div>
  );
}

export default function AdminStorePage() {
  const [query, setQuery] = useState<AdminStoreListQuery>({ page: 1, limit: 20 });
  const [search, setSearch] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [modal, setModal] = useState<'approve' | 'reject' | 'suspend' | 'fee' | null>(null);

  const { data, isLoading, refetch } = useAdminStores({ ...query, search: search || undefined });

  const handleAction = (type: 'approve' | 'reject' | 'suspend' | 'fee') => setModal(type);
  const handleModalSuccess = () => { setModal(null); refetch(); };

  return (
    <div className="flex h-full">
      <div className="w-80 flex-shrink-0 border-r border-zinc-200 bg-white flex flex-col">
        <div className="p-4 border-b border-zinc-200 space-y-3 flex-shrink-0">
          <h1 className="text-base font-bold text-zinc-900">Quản lý cửa hàng</h1>
          <SearchInput value={search} onChange={(v) => { setSearch(v); setQuery((q) => ({ ...q, page: 1 })); }} placeholder="Tìm tên, email, SĐT..." />
          <select
            onChange={(e) => setQuery((q) => ({ ...q, status: e.target.value as any || undefined, page: 1 }))}
            className="w-full bg-white border border-zinc-200 text-zinc-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-zinc-400 shadow-sm"
          >
            <option value="">Tất cả trạng thái</option>
            {Object.entries(sellerStatusCfg).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-16 bg-zinc-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="divide-y divide-zinc-200">
                {data?.data.map((store) => {
                  const st = sellerStatusCfg[store.status];
                  const isSelected = selectedStore?.sellerId === store.sellerId;
                  return (
                    <button
                      key={store.sellerId}
                      onClick={() => setSelectedStore(store)}
                      className={`w-full text-left px-4 py-3.5 transition-colors ${isSelected ? 'bg-indigo-50 border-l-2 border-l-indigo-500' : 'hover:bg-zinc-50 border-l-2 border-l-transparent'}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-zinc-900 truncate">{store.storeName}</p>
                          <p className="text-xs text-zinc-500 truncate">{store.user.email}</p>
                        </div>
                        <span className={`inline-flex items-center px-1.5 py-0.5 text-xs rounded-full border flex-shrink-0 ${st.cls}`}>{st.label}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-zinc-500">{store.orderStats.totalOrders} đơn</span>
                        <span className="text-xs text-zinc-500">{fmt(store.orderStats.totalRevenue)}</span>
                      </div>
                    </button>
                  );
                })}
                {data?.data.length === 0 && (
                  <p className="text-sm text-zinc-500 text-center py-10">Không tìm thấy cửa hàng</p>
                )}
              </div>
              {data && (
                <div className="p-3">
                  <Pagination meta={data.meta} page={query.page ?? 1} onChange={(p) => setQuery((q) => ({ ...q, page: p }))} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {selectedStore ? (
          <StoreDetailPanel store={selectedStore} onAction={handleAction} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-500 bg-zinc-50">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016 2.993 2.993 0 0 0 2.25-1.016 3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
            </svg>
            <p className="text-sm">Chọn một cửa hàng để xem chi tiết</p>
          </div>
        )}
      </div>

      {selectedStore && (
        <>
          <SellerApproveModal open={modal === 'approve'} store={selectedStore} onClose={() => setModal(null)} onSuccess={handleModalSuccess} />
          <SellerRejectModal open={modal === 'reject'} store={selectedStore} onClose={() => setModal(null)} onSuccess={handleModalSuccess} />
          <SellerSuspendModal open={modal === 'suspend'} store={selectedStore} onClose={() => setModal(null)} onSuccess={handleModalSuccess} />
          <UpdateStoreFeeModal open={modal === 'fee'} store={selectedStore} onClose={() => setModal(null)} onSuccess={handleModalSuccess} />
        </>
      )}
    </div>
  );
}
