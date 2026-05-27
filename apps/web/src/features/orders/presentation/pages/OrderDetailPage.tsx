import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetOrder } from '../hooks/useOrders';
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

export const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useGetOrder(orderId || '');

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="mb-4 text-red-600">Order not found</p>
          <Button onClick={() => navigate(ROUTES.ORDERS)}>Back to Orders</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-12 w-48 mb-8" />
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Order {order.orderNumber}</h1>
          <p className="text-gray-600">Order ID: {order.id}</p>
        </div>
        <Button onClick={() => navigate(ROUTES.ORDERS)}>Back to Orders</Button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Status */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Order Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Order Status</span>
                <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Payment Status</span>
                <Badge variant={paymentStatusVariant[order.paymentStatus]}>{order.paymentStatus}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Order Date</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated</span>
                <span>{formatDate(order.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Items</h2>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 pb-4 border-b last:border-b-0">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                    <p className="text-sm">Qty: {item.quantity}</p>
                    <p className="text-sm text-gray-500">Seller: {item.sellerId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                    <p className="text-sm text-gray-500">{formatCurrency(item.price)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Notes</h2>
              <p className="text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="space-y-2 text-sm">
              <p className="font-semibold">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.ward}, {order.shippingAddress.district}</p>
              <p>{order.shippingAddress.province}, {order.shippingAddress.country}</p>
              <p>{order.shippingAddress.postalCode}</p>
              <p className="mt-3 font-semibold">Phone: {order.shippingAddress.phone}</p>
              <p>Email: {order.shippingAddress.email}</p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
            <div className="space-y-2 text-sm">
              <p className="capitalize">Method: {order.paymentMethod.replace('_', ' ')}</p>
              <p>Status: <Badge variant={paymentStatusVariant[order.paymentStatus]}>{order.paymentStatus}</Badge></p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatCurrency(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-red-600">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {order.status === 'pending' && (
            <Button onClick={() => {}} className="w-full" variant="danger">
              Cancel Order
            </Button>
          )}
          {order.status === 'delivered' && (
            <Button onClick={() => {}} className="w-full" variant="primary">
              Return Order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
