import React, { useState } from "react";
import { Modal } from "@/shared/components/ui/Modal";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { formatCurrency, formatDate } from "@/shared/utils/format";
import type { SellerOrder } from "@/features/sellers/domain/entities/seller.entity";
import type { OrderStatus, PaymentStatus } from "@/core/types/enum";
import { useConfirmOrder, useCancelOrder } from "@/features/orders/presentation/hooks/useOrders";

const orderStatusVariant: Record<
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
  REFUNDED: "danger",
  RETURN_REQUESTED: "warning",
};

const orderStatusLabel: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  WAITING_SELLER_CONFIRMATION: "Chờ xác nhận",
  SELLER_CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  RETURN_REQUESTED: "Yêu cầu hoàn trả",
  REFUNDED: "Đã hoàn trả",
};

const paymentStatusLabel: Record<PaymentStatus, string> = {
  PENDING: "Chờ thanh toán",
  WAITING_COD_COLLECTION: "Chờ thu tiền COD",
  COMPLETED: "Đã thanh toán",
  FAILED: "Thất bại",
  REFUNDED: "Đã hoàn trả",
};

interface Props {
  isOpen: boolean;
  order: SellerOrder;
  onClose: () => void;
  onOrderUpdated?: () => void;
}

export const SellerOrderDetailModal: React.FC<Props> = ({
  isOpen,
  order,
  onClose,
  onOrderUpdated,
}) => {
  const [confirming, setConfirming] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const confirmMutation = useConfirmOrder();
  const cancelMutation = useCancelOrder();

  const handleConfirmOrder = () => {
    confirmMutation.mutate(order.orderId, {
      onSuccess: () => {
        setConfirming(false);
        onOrderUpdated?.();
        onClose();
      },
    });
  };

  const handleRejectOrder = () => {
    cancelMutation.mutate(order.orderId, {
      onSuccess: () => {
        setRejecting(false);
        onOrderUpdated?.();
        onClose();
      },
    });
  };

  // TODO: cần thêm API xử lý return phía backend
  const handleApproveReturn = () => {
    console.log("Approve return for order:", order.orderId);
  };

  const handleRejectReturn = () => {
    console.log("Reject return for order:", order.orderId);
  };

  const payment = order.payments[0];
  const isActioning = confirmMutation.isPending || cancelMutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6 max-w-2xl w-full">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Đơn hàng #{order.orderId}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <Badge variant={orderStatusVariant[order.status]}>
            {orderStatusLabel[order.status]}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="border rounded-lg p-4 space-y-2">
            <p className="font-semibold text-gray-700">Thông tin người mua</p>
            <p>{order.buyer.fullName}</p>
            <p className="text-gray-500">{order.buyer.user.email}</p>
            {order.buyer.user.phone && (
              <p className="text-gray-500">{order.buyer.user.phone}</p>
            )}
          </div>
          <div className="border rounded-lg p-4 space-y-2">
            <p className="font-semibold text-gray-700">Thông tin nhận hàng</p>
            <p>{order.receiverName}</p>
            <p className="text-gray-500">{order.receiverPhone}</p>
            <p className="text-gray-500">{order.shippingAddress}</p>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="border-b text-left text-gray-500">
                <th className="px-4 py-2">Sản phẩm</th>
                <th className="px-4 py-2">SL</th>
                <th className="px-4 py-2">Đơn giá</th>
                <th className="px-4 py-2">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {order.orderItems.map((item) => (
                <tr key={item.orderItemId}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {item.product.images?.[0]?.imageUrl && (
                        <img
                          src={item.product.images[0].imageUrl}
                          alt=""
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <span className="font-medium">{item.product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-4 py-3 font-semibold">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Tạm tính</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Phí vận chuyển</span>
            <span>{formatCurrency(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Phí nền tảng</span>
            <span>{formatCurrency(order.platformFee)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 font-bold">
            <span>Người bán nhận</span>
            <span className="text-green-600">
              {formatCurrency(order.sellerAmount)}
            </span>
          </div>
        </div>

        {payment && (
          <div className="text-sm text-gray-600">
            <span>Thanh toán: </span>
            <span className="font-semibold">
              {order.paymentMethod === "COD" ? "COD" : "Online"} —{" "}
              {paymentStatusLabel[payment.status]}
            </span>
            {payment.transactionId && (
              <span className="ml-2 font-mono text-xs text-gray-400">
                ({payment.transactionId})
              </span>
            )}
          </div>
        )}

        {order.shipment?.trackingCode && (
          <div className="text-sm">
            <span className="text-gray-500">Mã vận đơn: </span>
            <span className="font-mono font-semibold">
              {order.shipment.trackingCode}
            </span>
          </div>
        )}

        <div className="flex gap-3 justify-end border-t pt-4">
          {order.status === "WAITING_SELLER_CONFIRMATION" &&
            !confirming &&
            !rejecting && (
              <>
                <Button
                  variant="danger"
                  onClick={() => setRejecting(true)}
                  disabled={isActioning}
                >
                  Từ chối đơn
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setConfirming(true)}
                  disabled={isActioning}
                >
                  Xác nhận đơn
                </Button>
              </>
            )}

          {confirming && (
            <div className="flex items-center gap-3 w-full">
              <p className="text-sm text-gray-600 flex-1">
                Xác nhận nhận đơn hàng #{order.orderId}?
              </p>
              <Button
                variant="secondary"
                onClick={() => setConfirming(false)}
                disabled={confirmMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmOrder}
                disabled={confirmMutation.isPending}
              >
                {confirmMutation.isPending ? "Đang xử lý..." : "Xác nhận"}
              </Button>
            </div>
          )}

          {rejecting && (
            <div className="flex items-center gap-3 w-full">
              <p className="text-sm text-gray-600 flex-1">
                Từ chối đơn hàng #{order.orderId}?
              </p>
              <Button
                variant="secondary"
                onClick={() => setRejecting(false)}
                disabled={cancelMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                variant="danger"
                onClick={handleRejectOrder}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? "Đang xử lý..." : "Từ chối"}
              </Button>
            </div>
          )}

          {order.status === "RETURN_REQUESTED" && (
            <>
              <Button variant="danger" onClick={handleRejectReturn}>
                Từ chối hoàn trả
              </Button>
              <Button variant="primary" onClick={handleApproveReturn}>
                Chấp nhận hoàn trả
              </Button>
            </>
          )}

          {!confirming && !rejecting && (
            <Button variant="secondary" onClick={onClose} disabled={isActioning}>
              Đóng
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
