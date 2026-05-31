import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "@/core/store/auth.store";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { useToast } from "@/shared/hooks/useToast";
import { ROUTES } from "@/core/router/routes";
import { formatCurrency } from "@/shared/utils/format";
import { useCreateOrder } from "@/features/orders/presentation/hooks/useOrders";
import { useGetCart } from "@/features/cart/presentation/hooks/useCart";

const BANK_NAME = import.meta.env.VITE_BANK_NAME ?? "Vietcombank";
const BANK_ACCOUNT = import.meta.env.VITE_BANK_ACCOUNT ?? "1021576686";
const BANK_OWNER = import.meta.env.VITE_BANK_OWNER ?? "Chu Tai Khoan";
const QR_COUNTDOWN = 60;

function buildQrUrl(ref: string) {
  const content = encodeURIComponent(`Thanh toan don hang ${ref}`);
  const name = encodeURIComponent(BANK_OWNER);
  return `https://api.vietqr.io/${BANK_NAME}/${BANK_ACCOUNT}/${content}/compact.jpg?accountName=${name}`;
}

interface QrModalProps {
  paymentRef: string;
  amount: number;
  onConfirm: () => void;
  onClose: () => void;
}

const QrModal: React.FC<QrModalProps> = ({ paymentRef, amount, onConfirm, onClose }) => {
  const [seconds, setSeconds] = useState(QR_COUNTDOWN);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          onClose();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [onClose]);

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - seconds / QR_COUNTDOWN);
  const isUrgent = seconds <= 10;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-4">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-lg font-bold">Quét mã QR để thanh toán</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="text-center text-sm text-gray-500 space-y-0.5">
          <p>
            <span className="font-medium text-gray-700">{BANK_NAME}</span>
            {" — "}TK:{" "}
            <span className="font-medium text-gray-700">{BANK_ACCOUNT}</span>
          </p>
          <p>
            Chủ TK:{" "}
            <span className="font-medium text-gray-700">{BANK_OWNER}</span>
          </p>
          <p className="text-base font-semibold text-red-600 mt-1">
            {formatCurrency(amount)}
          </p>
        </div>

        <div className="border rounded-xl p-2 bg-gray-50">
          <img
            src={buildQrUrl(paymentRef)}
            alt="QR chuyển khoản"
            className="w-52 h-52 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.png";
            }}
          />
        </div>

        <p className="text-center text-sm text-gray-600">
          Hãy chuyển khoản theo mã QR trên màn hình để hoàn tất đơn hàng.
          <br />
          Nội dung:{" "}
          <span className="font-medium">Thanh toan don hang {paymentRef}</span>
        </p>

        <div className="flex flex-col items-center gap-1">
          <svg width="52" height="52" className="-rotate-90">
            <circle cx="26" cy="26" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="4" />
            <circle
              cx="26" cy="26" r={radius}
              fill="none"
              stroke={isUrgent ? "#ef4444" : "#3b82f6"}
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
            />
          </svg>
          <span className={`text-sm font-semibold ${isUrgent ? "text-red-500" : "text-gray-500"}`}>
            {seconds}s
          </span>
        </div>

        <Button onClick={onConfirm} className="w-full" size="lg">
          Đã chuyển khoản thành công
        </Button>
        <p className="text-xs text-gray-400 italic">
          Nút này chỉ dùng để test, không dùng cho production
        </p>
      </div>
    </div>
  );
};

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuthStore();

  const { data: cartData, isLoading } = useGetCart();
  const cartItems = cartData?.items ?? [];
  const { mutate: createOrder, isPending } = useCreateOrder();

  const [shippingAddress, setShippingAddress] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");
  const [showQr, setShowQr] = useState(false);

  const paymentRef = useRef(`TMP-${Date.now()}`);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0),
    [cartItems],
  );

  const shippingFee = 0;
  const estimatedTotal = subtotal + shippingFee;

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p className="text-lg font-medium mb-4">Bạn cần đăng nhập để thanh toán</p>
          <Button onClick={() => navigate(ROUTES.LOGIN)}>Đăng nhập</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p className="text-lg font-medium">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p className="text-lg font-medium mb-4">Giỏ hàng của bạn đang trống</p>
          <Button onClick={() => navigate(ROUTES.PRODUCTS)}>Tiếp tục mua sắm</Button>
        </div>
      </div>
    );
  }

  const validate = () => {
    if (!receiverName.trim()) { toast.error("Vui lòng nhập tên người nhận"); return false; }
    if (!receiverPhone.trim()) { toast.error("Vui lòng nhập số điện thoại"); return false; }
    if (!shippingAddress.trim()) { toast.error("Vui lòng nhập địa chỉ giao hàng"); return false; }
    return true;
  };

  const submitOrder = () => {
    console.log("Submitting order with:", {
      receiverName,
      receiverPhone,
      shippingAddress,
      paymentMethod,
    });
    
    createOrder(
      {
        receiverName: receiverName.trim(),
        receiverPhone: receiverPhone.trim(),
        shippingAddress: shippingAddress.trim(),
        paymentMethod: paymentMethod,
      },
      {
        onSuccess: (orders) => {
          toast.success("Đặt hàng thành công");
          if (orders?.length > 0) {
            navigate(`${ROUTES.ORDERS}/${orders[0].orderId}`);
            return;
          }
          navigate(ROUTES.ORDERS);
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : "Không thể tạo đơn hàng");
        },
      },
    );
  };

  const handleCheckout = () => {
    if (!validate()) return;
    if (paymentMethod === "ONLINE") {
      paymentRef.current = `TMP-${Date.now()}`;
      setShowQr(true);
      return;
    }
    submitOrder();
  };

  const handleQrConfirm = () => {
    setShowQr(false);
    submitOrder();
  };

  const handleQrClose = () => {
    setShowQr(false);
    toast.error("Mã QR đã hết hiệu lực, vui lòng thử lại");
  };

  return (
    <>
      {showQr && (
        <QrModal
          paymentRef={paymentRef.current}
          amount={estimatedTotal}
          onConfirm={handleQrConfirm}
          onClose={handleQrClose}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-5">Thông tin nhận hàng</h2>
              <div className="space-y-4">
                <Input
                  label="Tên người nhận"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  placeholder="Nhập họ tên"
                />
                <Input
                  label="Số điện thoại"
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                  placeholder="Nhập số điện thoại"
                />
                <Input
                  label="Địa chỉ giao hàng"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Nhập địa chỉ giao hàng"
                />
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-5">Sản phẩm đặt mua</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={`${item.productId}-${item.product.seller}`}
                    className="flex gap-4 pb-4 border-b last:border-b-0"
                  >
                    <img
                      src={item.product.images?.[0]?.imageUrl ?? "/placeholder.png"}
                      alt={item.product.name}
                      className="w-20 h-20 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{item.product.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">SKU: {item.productId}</p>
                      <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">
                        {formatCurrency(Number(item.product.price) * item.quantity)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatCurrency(Number(item.product.price))}/sp
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-5">Phương thức thanh toán</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment-method"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="w-4 h-4"
                  />
                  <span>Thanh toán khi nhận hàng (COD)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment-method"
                    value="ONLINE"
                    checked={paymentMethod === "ONLINE"}
                    onChange={() => setPaymentMethod("ONLINE")}
                    className="w-4 h-4"
                  />
                  <span>Chuyển khoản ngân hàng</span>
                </label>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6 h-fit sticky top-24">
            <h2 className="text-xl font-semibold mb-5">Tóm tắt đơn hàng</h2>
            <div className="space-y-3 mb-5">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>{shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-lg font-bold">
                <span>Tổng cộng</span>
                <span className="text-red-600">{formatCurrency(estimatedTotal)}</span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={isPending}
              className="w-full"
              size="lg"
            >
              {isPending ? "Đang xử lý..." : paymentMethod === "ONLINE" ? "Đặt hàng & Thanh toán" : "Đặt hàng"}
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="w-full mt-3"
              disabled={isPending}
              onClick={() => navigate(ROUTES.CART)}
            >
              Quay lại giỏ hàng
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
