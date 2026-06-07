import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetOrder } from "../hooks/useOrders";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { formatCurrency, formatDate } from "@/shared/utils/format";
import { ROUTES } from "@/core/router/routes";
import type {
  OrderStatus,
  PaymentStatus,
} from "@/features/orders/domain/entities/order.entity";
import { useCompleteOrder } from "../hooks/useOrders";

const statusVariant: Record<
  OrderStatus,
  "primary" | "secondary" | "success" | "danger" | "warning"
> = {
  PENDING_PAYMENT: "warning",
  PAID: "primary",
  WAITING_SELLER_CONFIRMATION: "warning",
  SELLER_CONFIRMED: "primary",
  SHIPPING: "secondary",
  DELIVERED: "success",
  COMPLETED: "success",
  CANCELLED: "danger",
  REFUNDED: "secondary",
  RETURN_REQUESTED: "warning",
};

const statusLabel: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  WAITING_SELLER_CONFIRMATION: "Chờ xác nhận từ người bán",
  SELLER_CONFIRMED: "Người bán đã xác nhận",
  SHIPPING: "Đang giao hàng",
  DELIVERED: "Đã giao hàng",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  REFUNDED: "Đã hoàn tiền",
  RETURN_REQUESTED: "Yêu cầu hoàn trả",
};

const paymentStatusVariant: Record<
  PaymentStatus,
  "primary" | "secondary" | "success" | "danger" | "warning"
> = {
  PENDING: "warning",
  WAITING_COD_COLLECTION: "warning",
  WAITING_ONLINE_PAYMENT: "warning",
  COMPLETED: "success",
  FAILED: "danger",
  REFUNDED: "secondary",
};

// const paymentStatusLabel: Record<PaymentStatus, string> = {
//   PENDING: "Chờ thanh toán",
//   WAITING_COD_COLLECTION: "Chờ thu tiền COD",
//   WAITING_ONLINE_PAYMENT: "Chờ thanh toán online",
//   COMPLETED: "Đã thanh toán",
//   FAILED: "Thất bại",
//   REFUNDED: "Đã hoàn tiền",
// };

const paymentMethodLabel: Record<string, string> = {
  COD: "Thanh toán khi nhận hàng (COD)",
  ONLINE: "Chuyển khoản ngân hàng",
};

export const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const orderIdNum = orderId ? parseInt(orderId, 10) : undefined;
  const { data: order, isLoading, error } = useGetOrder(orderIdNum);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="mb-4 text-red-600">Không tìm thấy đơn hàng</p>
          <Button onClick={() => navigate(ROUTES.ORDERS)}>
            Quay lại danh sách đơn hàng
          </Button>
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
          <h1 className="text-3xl font-bold mb-2">Đơn hàng #{order.orderId}</h1>
          {order.seller && (
            <p className="text-gray-600">Người bán: {order.seller.storeName}</p>
          )}
        </div>
        <Button onClick={() => navigate(ROUTES.ORDERS)}>
          Quay lại danh sách đơn hàng
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Trạng thái đơn hàng</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Trạng thái</span>
                <Badge variant={statusVariant[order.status]}>
                  {statusLabel[order.status]}
                </Badge>
              </div>
              {payment && (
                <div className="flex justify-between items-center">
                  <span>Thanh toán</span>
                  <Badge variant={paymentStatusVariant[payment.status]}>
                    {paymentMethodLabel[payment.method] ?? payment.method}
                  </Badge>
                </div>
              )}
              {order.shipment?.trackingCode && (
                <div className="flex justify-between">
                  <span>Mã vận đơn</span>
                  <span className="font-mono">
                    {order.shipment.trackingCode}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Ngày đặt hàng</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cập nhật lần cuối</span>
                <span>{formatDate(order.updatedAt)}</span>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Sản phẩm</h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => {
                const image = item.product.images?.[0]?.imageUrl;
                return (
                  <div
                    key={item.orderItemId}
                    className="flex gap-4 pb-4 border-b last:border-b-0"
                  >
                    {image && (
                      <img
                        src={image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">
                        Số lượng: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.unitPrice)}/sp
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Thông tin nhận hàng</h2>
            <div className="space-y-2 text-sm">
              <p className="font-semibold">Người nhận: {order.receiverName}</p>
              <p className="font-semibold">Địa chỉ: {order.shippingAddress}</p>
              <p className="mt-3 font-semibold">
                Điện thoại: {order.receiverPhone}
              </p>
            </div>
          </div>

          {payment && (
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Thông tin thanh toán
              </h2>
              <div className="space-y-2 text-sm">
                <p>
                  Phương thức:{" "}
                  <span className="font-semibold">
                    {paymentMethodLabel[payment.method] ?? payment.method}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  Trạng thái:{" "}
                  <span className="font-semibold">
                    {statusLabel[order.status]}
                  </span>
                </p>
                {payment.transactionId && (
                  <p>
                    Mã giao dịch:{" "}
                    <span className="font-mono">{payment.transactionId}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>
                  {order.shippingFee === 0
                    ? "Miễn phí"
                    : formatCurrency(order.shippingFee)}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Tổng cộng</span>
                <span className="text-red-600">
                  {formatCurrency(order.totalAmount + order.shippingFee)}
                </span>
              </div>
            </div>
          </div>

          {order.status === "PENDING_PAYMENT" && (
            <Button onClick={() => {}} className="w-full" variant="danger">
              Hủy đơn hàng
            </Button>
          )}
          {order.status === "DELIVERED" && (
            <div className="space-y-2">
              <Button onClick={() => {}} className="w-full" variant="primary">
                Yêu cầu hoàn trả
              </Button>
              <ConfirmReceivedButton orderId={order.orderId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ConfirmReceivedButton: React.FC<{ orderId: number }> = ({ orderId }) => {
  const mutation = useCompleteOrder();
  const isLoading = (mutation as any).isLoading || false;
  return (
    <Button
      variant="primary"
      className="w-full"
      onClick={() => mutation.mutate(orderId)}
      disabled={isLoading}
    >
      {isLoading ? 'Đang xác nhận...' : 'Xác nhận đã nhận hàng'}
    </Button>
  );
};
