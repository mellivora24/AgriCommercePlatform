import { useAdminDashboard } from '@/features/admin/presentation/hooks/useAdmin';

const fmt = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', notation: 'compact', maximumFractionDigits: 1 }).format(n);

const fmtFull = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const fmtDate = (d: Date) =>
  new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(d);

const orderStatusLabel: Record<string, { label: string; cls: string }> = {
  PENDING_PAYMENT:           { label: 'Chờ thanh toán',   cls: 'bg-zinc-100 text-zinc-700' },
  PAID:                      { label: 'Đã thanh toán',    cls: 'bg-blue-500/20 text-blue-400' },
  WAITING_SELLER_CONFIRMATION: { label: 'Chờ xác nhận',  cls: 'bg-amber-500/20 text-amber-400' },
  SELLER_CONFIRMED:          { label: 'Đã xác nhận',      cls: 'bg-blue-500/20 text-blue-400' },
  SHIPPING:                  { label: 'Đang giao',        cls: 'bg-indigo-500/20 text-indigo-400' },
  DELIVERED:                 { label: 'Đã giao',          cls: 'bg-teal-500/20 text-teal-400' },
  COMPLETED:                 { label: 'Hoàn thành',       cls: 'bg-emerald-500/20 text-emerald-400' },
  CANCELLED:                 { label: 'Đã hủy',           cls: 'bg-red-500/20 text-red-400' },
  RETURN_REQUESTED:          { label: 'Yêu cầu hoàn',     cls: 'bg-orange-500/20 text-orange-400' },
  REFUNDED:                  { label: 'Đã hoàn tiền',     cls: 'bg-purple-500/20 text-purple-400' },
};

function StatCard({
  label, value, sub, icon, accent = false,
}: { label: string; value: string | number; sub?: string; icon: React.ReactNode; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 flex flex-col gap-3 ${accent ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-zinc-200'}`}>
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ? 'bg-indigo-100 text-indigo-600' : 'bg-zinc-100 text-zinc-500'}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className={`text-2xl font-bold tracking-tight ${accent ? 'text-indigo-700' : 'text-zinc-900'}`}>{value}</p>
        <p className="text-sm text-zinc-500 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-zinc-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return <div className="rounded-2xl border border-zinc-200 bg-white p-5 h-28 animate-pulse shadow-sm" />;
}

export default function AdminDashboardPage() {
  const { data, isLoading } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-7 w-36 bg-zinc-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const totalOrdersByStatus = data.orders.byStatus;

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Tổng quan hoạt động nền tảng</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tài chính</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            accent
            label="Tổng GMV (doanh thu toàn sàn)"
            value={fmt(data.finance.totalGmv)}
            sub={fmtFull(data.finance.totalGmv)}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" /></svg>}
          />
          <StatCard
            label="Doanh thu nền tảng (phí)"
            value={fmt(data.finance.totalPlatformFee)}
            sub={fmtFull(data.finance.totalPlatformFee)}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
          />
          {data.finance.platformWallet && (
            <StatCard
              label="Ký quỹ (Escrow)"
              value={fmt(data.finance.platformWallet.escrowBalance)}
              sub={`Doanh thu: ${fmt(data.finance.platformWallet.revenueBalance)}`}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>}
            />
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Người dùng & Cửa hàng</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Tổng người dùng" value={data.users.total.toLocaleString('vi-VN')}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>}
          />
          <StatCard label="Người mua" value={data.users.buyers.toLocaleString('vi-VN')}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>}
          />
          <StatCard label="Cửa hàng" value={data.users.sellers.toLocaleString('vi-VN')}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016 2.993 2.993 0 0 0 2.25-1.016 3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" /></svg>}
          />
          <StatCard label="Shipper" value={data.users.shippers.toLocaleString('vi-VN')}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Đơn hàng & Chờ xử lý</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Tổng đơn hàng" value={data.orders.total.toLocaleString('vi-VN')}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" /></svg>}
          />
          <StatCard label="Hoàn thành" value={data.orders.completed.toLocaleString('vi-VN')}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
          />
          <StatCard label="Cửa hàng chờ duyệt" value={data.pending.sellerApprovals}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
          />
          <StatCard label="Rút tiền chờ duyệt" value={data.pending.withdrawalsPending}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900 mb-4">Đơn hàng gần đây</h2>
          <div className="space-y-0 divide-y divide-zinc-200">
            {data.recentOrders.slice(0, 8).map((order) => (
              <div key={order.orderId} className="flex items-center justify-between py-3 gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-900">#{order.orderId}</span>
                    <span className={`inline-flex px-2 py-0.5 text-xs rounded-full ${orderStatusLabel[order.status]?.cls ?? 'bg-zinc-100 text-zinc-700'}`}>
                      {orderStatusLabel[order.status]?.label ?? order.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5 truncate">
                    {order.buyer?.fullName ?? '—'} · {order.seller?.storeName ?? '—'}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-zinc-900">{fmtFull(order.totalAmount)}</p>
                  <p className="text-xs text-zinc-500">{fmtDate(order.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900 mb-4">Phân bổ đơn hàng</h2>
          <div className="space-y-2.5">
            {totalOrdersByStatus
              .sort((a, b) => b.count - a.count)
              .map((s) => {
                const st = orderStatusLabel[s.status];
                const pct = data.orders.total > 0 ? Math.round((s.count / data.orders.total) * 100) : 0;
                return (
                  <div key={s.status}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-zinc-600">{st?.label ?? s.status}</span>
                      <span className="text-xs text-zinc-500">{s.count.toLocaleString('vi-VN')} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
