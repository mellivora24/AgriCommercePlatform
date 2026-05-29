import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetOrder } from '../hooks/useOrders';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { formatCurrency, formatDate } from '@/shared/utils/format';
import { ROUTES } from '@/core/router/routes';
import type { OrderStatus, PaymentStatus } from '../../domain/entities/order.entity';

const statusVariant: Record<OrderStatus, 'primary' | 'secondary' | 'success' | 'danger' | 'warning'> = {
  PENDING_PAYMENT: 'warning',
  SELLER_CONFIRMED: 'primary',
  SHIPPING: 'secondary',
  DELIVERED: 'success',
  COMPLETED: 'success',
  CANCELLED: 'danger',
  RETURNED: 'danger',
};

const statusLabel: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'Pending Payment',
  SELLER_CONFIRMED: 'Confirmed by Seller',
  SHIPPING: 'Shipping',
  DELIVERED: 'Delivered',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  RETURNED: 'Returned',
};

const paymentStatusVariant: Record<PaymentStatus, 'primary' | 'secondary' | 'success' | 'danger' | 'warning'> = {
  PENDING: 'warning',
  WAITING_COD_COLLECTION: 'warning',
  COMPLETED: 'success',
  FAILED: 'danger',
  REFUNDED: 'secondary',
};

const paymentStatusLabel: Record<PaymentStatus, string> = {
  PENDING: 'Pending',
  WAITING_COD_COLLECTION: 'Awaiting COD Collection',
  COMPLETED: 'Paid',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
};

export const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  // orderId from URL is a string; parse to number for BE
  const orderIdNum = orderId ? parseInt(orderId, 10) : undefined;
  const { data: order, isLoading, error } = useGetOrder(orderIdNum);

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

  const payment = order.payments[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Order #{order.orderId}</h1>
          {order.seller && (
            <p className="text-gray-600">Sold by: {order.seller.storeName}</p>
          )}
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
                <Badge variant={statusVariant[order.status]}>{statusLabel[order.status]}</Badge>
              </div>
              {payment && (
                <div className="flex justify-between items-center">
                  <span>Payment Status</span>
                  <Badge variant={paymentStatusVariant[payment.status]}>
                    {paymentStatusLabel[payment.status]}
                  </Badge>
                </div>
              )}
              {order.shipment?.trackingCode && (
                <div className="flex justify-between">
                  <span>Tracking Code</span>
                  <span className="font-mono">{order.shipment.trackingCode}</span>
                </div>
              )}
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
              {order.orderItems.map(item => {
                const image = item.product.images?.[0]?.imageUrl;
                return (
                  <div key={item.orderItemId} className="flex gap-4 pb-4 border-b last:border-b-0">
                    {image && (
                      <img
                        src={image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-sm">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.unitPrice)} each
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Shipping Info — flat fields as per BE schema */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="space-y-2 text-sm">
              <p className="font-semibold">{order.receiverName}</p>
              <p>{order.shippingAddress}</p>
              <p className="mt-3 font-semibold">Phone: {order.receiverPhone}</p>
            </div>
          </div>

          {/* Payment Information */}
          {payment && (
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
              <div className="space-y-2 text-sm">
                <p>Method: <span className="font-semibold">{payment.method}</span></p>
                <p className="flex items-center gap-2">
                  Status:{' '}
                  <Badge variant={paymentStatusVariant[payment.status]}>
                    {paymentStatusLabel[payment.status]}
                  </Badge>
                </p>
                {payment.transactionId && (
                  <p>Transaction ID: <span className="font-mono">{payment.transactionId}</span></p>
                )}
              </div>
            </div>
          )}

          {/* Order Summary — BE fields: totalAmount, platformFee, sellerAmount, shippingFee */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>
                  {order.shippingFee === 0 ? 'Free' : formatCurrency(order.shippingFee)}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-red-600">
                  {formatCurrency(order.totalAmount + order.shippingFee)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {order.status === 'PENDING_PAYMENT' && (
            <Button onClick={() => {}} className="w-full" variant="danger">
              Cancel Order
            </Button>
          )}
          {order.status === 'DELIVERED' && (
            <Button onClick={() => {}} className="w-full" variant="primary">
              Return Order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
