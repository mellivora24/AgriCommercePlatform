import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListOrders } from '../hooks/useOrders';
import { useAuthStore } from '@/core/store/auth.store';
import { Pagination } from '@/shared/components/ui/Pagination';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { formatCurrency, formatDate } from '@/shared/utils/format';
import { ROUTES } from '@/core/router/routes';

const statusVariant: Record<string, 'primary' | 'secondary' | 'success' | 'danger' | 'warning'> = {
  pending: 'warning',
  confirmed: 'primary',
  shipped: 'secondary',
  delivered: 'success',
  cancelled: 'danger',
  returned: 'danger',
};

const paymentStatusVariant: Record<string, 'primary' | 'secondary' | 'success' | 'danger' | 'warning'> = {
  pending: 'warning',
  completed: 'success',
  failed: 'danger',
  refunded: 'secondary',
};

export const OrdersListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useListOrders(page, 10);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="mb-4">Please login to view your orders</p>
          <Button onClick={() => navigate(ROUTES.LOGIN)}>Login</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="text-center py-12">
          <p className="mb-4">You haven't placed any orders yet</p>
          <Button onClick={() => navigate(ROUTES.PRODUCTS)}>Start Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-4">
        {data.items.map(order => (
          <div key={order.id} className="border rounded-lg p-4 hover:shadow-lg transition cursor-pointer" onClick={() => navigate(`${ROUTES.ORDERS}/${order.id}`)}>
            <div className="grid grid-cols-5 gap-4 items-start">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-semibold">{order.orderNumber}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold">{formatDate(order.createdAt)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-semibold text-lg text-red-600">{formatCurrency(order.total)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
              </div>

              <div>
                <p className="text-sm text-gray-500">Payment</p>
                <Badge variant={paymentStatusVariant[order.paymentStatus]}>{order.paymentStatus}</Badge>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t grid grid-cols-2 text-sm text-gray-600">
              <p>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
              <p className="text-right">Items: {order.items.map(item => item.name).join(', ')}</p>
            </div>
          </div>
        ))}
      </div>

      {data.total > 10 && (
        <div className="mt-8 flex justify-center">
          <Pagination currentPage={page} totalPages={Math.ceil(data.total / 10)} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
};
