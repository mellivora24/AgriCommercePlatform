import React, { useState } from 'react';
import { useSellerOrders } from '../hooks/useSeller';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Pagination } from '@/shared/components/ui/Pagination';
import { formatCurrency, formatDate } from '@/shared/utils/format';
import { SellerOrderDetailModal } from '@/features/sellers/presentation/components/SellerOrderDetailModal';
import type { SellerOrder, SellerOrdersFilter } from '@/features/sellers/domain/entities/seller.entity';

type SellerOrderStatus = SellerOrder['status'];
type SellerFilterStatus = SellerOrdersFilter['status'];

const orderStatusVariant: Record<SellerOrderStatus, 'primary' | 'secondary' | 'success' | 'danger' | 'warning'> = {
  PENDING_PAYMENT: 'warning',
  PAID: 'primary',
  WAITING_SELLER_CONFIRMATION: 'warning',
  SELLER_CONFIRMED: 'primary',
  SHIPPING: 'secondary',
  DELIVERED: 'success',
  COMPLETED: 'success',
  CANCELLED: 'danger',
  RETURN_REQUESTED: 'danger',
  REFUNDED: 'danger'
};

const orderStatusLabel: Record<SellerOrderStatus, string> = {
  PENDING_PAYMENT: 'Chờ thanh toán',
  PAID: 'Đã thanh toán',
  WAITING_SELLER_CONFIRMATION: 'Chờ xác nhận',
  SELLER_CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
  RETURN_REQUESTED: 'Yêu cầu hoàn trả',
  REFUNDED: 'Đã hoàn tiền',
};

const STATUS_TABS: { label: string; value: SellerFilterStatus }[] = [
  { label: 'Tất cả', value: undefined },
  { label: 'Chờ xác nhận', value: 'WAITING_SELLER_CONFIRMATION' },
  { label: 'Đã xác nhận', value: 'SELLER_CONFIRMED' },
  { label: 'Đang giao', value: 'SHIPPING' },
  { label: 'Hoàn thành', value: 'COMPLETED' },
  { label: 'Đã hủy', value: 'CANCELLED' },
  { label: 'Yêu cầu hoàn trả', value: 'RETURN_REQUESTED' },
  { label: 'Đã hoàn tiền', value: 'REFUNDED' },
];

export const SellerOrderPage: React.FC = () => {
  const [filter, setFilter] = useState<SellerOrdersFilter>({ page: 1, limit: 10 });
  const [keyword, setKeyword] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<SellerOrder | null>(null);

  const { data, isLoading, error } = useSellerOrders(filter);

  const handleSearch = () => {
    setFilter((f) => ({ ...f, keyword, page: 1 }));
  };

  const handleStatusTab = (status: SellerFilterStatus) => {
    setFilter((f) => ({ ...f, status, page: 1 }));
  };

  const handlePage = (page: number) => {
    setFilter((f) => ({ ...f, page }));
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="mb-4 text-red-600">Không thể tải danh sách đơn hàng</p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
      </div>

      {data?.statistics && data.statistics.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {data.statistics.map((s) => (
            <div key={s.status} className="border rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">{s.count}</p>
              <Badge variant={orderStatusVariant[s.status]}>{orderStatusLabel[s.status]}</Badge>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          placeholder="Tìm kiếm theo tên người mua, mã đơn..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch}>Tìm</Button>
      </div>

      <div className="flex gap-1 border-b overflow-x-auto">
        {STATUS_TABS.map((tab) => (
          <button
            key={String(tab.value)}
            onClick={() => handleStatusTab(tab.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              filter.status === tab.value
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="text-center py-16 text-gray-500">Không có đơn hàng nào</div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b text-left text-gray-500">
                  <th className="px-4 py-3">Mã đơn</th>
                  <th className="px-4 py-3">Người mua</th>
                  <th className="px-4 py-3">Sản phẩm</th>
                  <th className="px-4 py-3">Tổng tiền</th>
                  <th className="px-4 py-3">Phương thức</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Ngày đặt</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.items.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-blue-600">#{order.orderId}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{order.buyer.fullName}</p>
                      <p className="text-xs text-gray-400">{order.buyer.user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {order.orderItems[0]?.product.images?.[0]?.imageUrl && (
                          <img
                            src={order.orderItems[0].product.images[0].imageUrl}
                            alt=""
                            className="w-10 h-10 rounded object-cover flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="truncate max-w-[150px]">{order.orderItems[0]?.product.name}</p>
                          {order.orderItems.length > 1 && (
                            <p className="text-xs text-gray-400">+{order.orderItems.length - 1} sản phẩm</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {order.paymentMethod === 'COD' ? 'COD' : 'Online'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={orderStatusVariant[order.status]}>
                        {orderStatusLabel[order.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Button variant="secondary" size="sm" onClick={() => setSelectedOrder(order)}>
                        Chi tiết
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={data.pagination.page}
                totalPages={data.pagination.totalPages}
                onPageChange={handlePage}
              />
            </div>
          )}
        </>
      )}

      {selectedOrder && (
        <SellerOrderDetailModal
          isOpen={Boolean(selectedOrder)}
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};
