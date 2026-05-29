import React from "react";
import { useNavigate } from "react-router-dom";
import { useListBuyerOrders } from "../hooks/useOrders";
import { useAuthStore } from "@/core/store/auth.store";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { formatCurrency, formatDate } from "@/shared/utils/format";
import { ROUTES } from "@/core/router/routes";
import type {
  OrderStatus,
  PaymentStatus,
} from "../../domain/entities/order.entity";

const statusVariant: Record<
  OrderStatus,
  "primary" | "secondary" | "success" | "danger" | "warning"
> = {
  PENDING_PAYMENT: "warning",
  SELLER_CONFIRMED: "primary",
  SHIPPING: "secondary",
  DELIVERED: "success",
  COMPLETED: "success",
  CANCELLED: "danger",
  RETURNED: "danger",
};

const statusLabel: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Pending Payment",
  SELLER_CONFIRMED: "Confirmed",
  SHIPPING: "Shipping",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
};

const paymentStatusVariant: Record<
  PaymentStatus,
  "primary" | "secondary" | "success" | "danger" | "warning"
> = {
  PENDING: "warning",
  WAITING_COD_COLLECTION: "warning",
  COMPLETED: "success",
  FAILED: "danger",
  REFUNDED: "secondary",
};

const paymentStatusLabel: Record<PaymentStatus, string> = {
  PENDING: "Pending",
  WAITING_COD_COLLECTION: "COD Pending",
  COMPLETED: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

export const OrdersListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: orders, isLoading } = useListBuyerOrders();

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

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="text-center py-12">
          <p className="mb-4">You haven't placed any orders yet</p>
          <Button onClick={() => navigate(ROUTES.PRODUCTS)}>
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const payment = order.payments[0];

          return (
            <div
              key={order.orderId}
              className="border rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`${ROUTES.ORDERS}/${order.orderId}`)}
            >
              <div className="grid grid-cols-5 gap-4 items-start">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold">#{order.orderId}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold">{formatDate(order.createdAt)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-semibold text-lg text-red-600">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant={statusVariant[order.status]}>
                    {statusLabel[order.status]}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Payment</p>
                  {payment ? (
                    <Badge variant={paymentStatusVariant[payment.status]}>
                      {paymentStatusLabel[payment.status]}
                    </Badge>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t grid grid-cols-2 text-sm text-gray-600">
                <p>
                  {order.orderItems.length} item
                  {order.orderItems.length !== 1 ? "s" : ""}
                </p>
                <p className="text-right">
                  {order.orderItems.map((item) => item.product.name).join(", ")}
                </p>
              </div>

              {order.seller && (
                <p className="mt-1 text-xs text-gray-400">
                  Sold by: {order.seller.storeName}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
