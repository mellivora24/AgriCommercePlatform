import React, { useState } from "react";
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

// ─── Review Popup ────────────────────────────────────────────────────────────

// interface ReviewPopupProps {
//   orderId: number;
//   onClose: () => void;
//   onSubmit: (orderId: number, rating: number, comment: string) => void;
// }
// const ReviewPopup: React.FC<ReviewPopupProps> = ({ orderId, onClose, onSubmit }) => {
//   const [rating, setRating] = useState(0);
//   const [hovered, setHovered] = useState(0);
//   const [comment, setComment] = useState("");

//   const handleSubmit = () => {
//     if (rating === 0) return;
//     onSubmit(orderId, rating, comment);
//     onClose();
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
//       onClick={onClose}
//     >
//       <div
//         className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h2 className="text-xl font-bold mb-1">Đánh giá đơn hàng #{orderId}</h2>
//         <p className="text-sm text-gray-500 mb-5">
//           Hãy cho chúng tôi biết trải nghiệm của bạn
//         </p>

//         {/* Star Rating */}
//         <div className="flex justify-center gap-2 mb-4">
//           {[1, 2, 3, 4, 5].map((star) => (
//             <button
//               key={star}
//               onClick={() => setRating(star)}
//               onMouseEnter={() => setHovered(star)}
//               onMouseLeave={() => setHovered(0)}
//               className="text-4xl transition-transform hover:scale-110 focus:outline-none"
//             >
//               <span
//                 className={
//                   star <= (hovered || rating)
//                     ? "text-yellow-400"
//                     : "text-gray-300"
//                 }
//               >
//                 ★
//               </span>
//             </button>
//           ))}
//         </div>

//         {rating > 0 && (
//           <p className="text-center text-sm text-gray-500 mb-4">
//             {["", "Rất tệ", "Tệ", "Bình thường", "Tốt", "Xuất sắc"][rating]}
//           </p>
//         )}

//         {/* Comment */}
//         <textarea
//           className="w-full border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//           rows={3}
//           placeholder="Nhận xét thêm về đơn hàng (tuỳ chọn)..."
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//         />

//         {/* Actions */}
//         <div className="flex gap-3 mt-4">
//           <Button
//             className="flex-1"
//             onClick={handleSubmit}
//             disabled={rating === 0}
//           >
//             Gửi đánh giá
//           </Button>
//           <Button className="flex-1" onClick={onClose}>
//             Huỷ
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// ─── Main Page ───────────────────────────────────────────────────────────────

export const OrdersListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: orders, isLoading } = useListBuyerOrders();

  // const [reviewingOrderId, setReviewingOrderId] = useState<number | null>(null);

  // const handleSubmitReview = (orderId: number, rating: number, comment: string) => {
  //   // TODO: gọi API gửi đánh giá
  //   console.log("Review submitted", { orderId, rating, comment });
  // };

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
        <h1 className="text-3xl font-bold mb-8">Đơn hàng của tôi</h1>
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
        <h1 className="text-3xl font-bold mb-8">Đơn hàng của tôi</h1>
        <div className="text-center py-12">
          <p className="mb-4">
            Bạn không có đơn hàng nào, hãy mua sắm ngay hôm nay!
          </p>
          <Button onClick={() => navigate(ROUTES.PRODUCTS)}>
            Mua sắm ngay
          </Button>
        </div>
      </div>
    );
  }

  // const canReview = (status: OrderStatus) =>
  //   status === "DELIVERED" || status === "COMPLETED";

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Đơn hàng của tôi</h1>

        <div className="space-y-4">
          {orders.map((order) => {
            const payment = order.payments[0];

            return (
              <div
                key={order.orderId}
                className="border rounded-lg p-4 hover:shadow-lg transition"
              >
                <div className="grid grid-cols-5 gap-4 items-start">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold">#{order.orderId}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                    <p className="font-semibold">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Số tiền</p>
                    <p className="font-semibold text-lg text-red-600">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <Badge variant={statusVariant[order.status]}>
                      {statusLabel[order.status]}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Phương thức thanh toán
                    </p>
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
                  <p>Số lượng mặt hàng: {order.orderItems.length}</p>
                  <p className="text-right">
                    {order.orderItems
                      .map((item) => item.product.name)
                      .join(", ")}
                  </p>
                </div>

                {order.seller && (
                  <p className="mt-2 text-sm">
                    Người bán: {order.seller.storeName}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex gap-2 justify-end">
                  {/* {canReview(order.status) && (
                    <Button
                      onClick={() => setReviewingOrderId(order.orderId)}
                    >
                      ★ Đánh giá
                    </Button>
                  )} */}
                  <Button
                    onClick={() =>
                      navigate(`${ROUTES.ORDERS}/${order.orderId}`)
                    }
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* {reviewingOrderId !== null && (
        <ReviewPopup
          orderId={reviewingOrderId}
          onClose={() => setReviewingOrderId(null)}
          onSubmit={handleSubmitReview}
        />
      )} */}
    </>
  );
};
