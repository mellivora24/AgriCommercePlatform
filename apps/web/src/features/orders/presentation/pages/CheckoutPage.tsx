import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "@/core/store/auth.store";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { useToast } from "@/shared/hooks/useToast";
import { ROUTES } from "@/core/router/routes";
import { formatCurrency } from "@/shared/utils/format";
import { useCreateOrder } from "@/features/orders/presentation/hooks/useOrders";
import { useGetCart } from "@/features/cart/presentation/hooks/useCart";

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuthStore();

  // console.log("Cart items:", rawCartItems);
  const { data: cartData, isLoading } = useGetCart();
  const cartItems = cartData?.items ?? [];
  const { mutate: createOrder, isPending } = useCreateOrder();

  const [shippingAddress, setShippingAddress] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0,
      ),
    [cartItems],
  );

  const shippingFee = 0;
  const estimatedTotal = subtotal + shippingFee;

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p className="text-lg font-medium mb-4">
            Bạn cần đăng nhập để thanh toán
          </p>
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
          <p className="text-lg font-medium mb-4">
            Giỏ hàng của bạn đang trống
          </p>
          <Button onClick={() => navigate(ROUTES.PRODUCTS)}>
            Tiếp tục mua sắm
          </Button>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!receiverName.trim()) {
      toast.error("Vui lòng nhập tên người nhận");
      return;
    }
    if (!receiverPhone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }
    if (!shippingAddress.trim()) {
      toast.error("Vui lòng nhập địa chỉ giao hàng");
      return;
    }

    createOrder(
      {
        receiverName: receiverName.trim(),
        receiverPhone: receiverPhone.trim(),
        shippingAddress: shippingAddress.trim(),
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
          toast.error(
            error instanceof Error ? error.message : "Không thể tạo đơn hàng",
          );
        },
      },
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping info */}
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

          {/* Order items */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-5">Sản phẩm đặt mua</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={`${item.productId}-${item.product.sellerId}`}
                  className="flex gap-4 pb-4 border-b last:border-b-0"
                >
                  <img
                    src={
                      item.product.images?.[0]?.imageUrl ?? "/placeholder.png"
                    }
                    alt={item.product.name}
                    className="w-20 h-20 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      SKU: {item.productId}
                    </p>
                    <p className="text-sm text-gray-500">
                      Số lượng: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">
                      {formatCurrency(
                        Number(item.product.price) * item.quantity,
                      )}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatCurrency(Number(item.product.price))}/sp
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment method */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-5">
              Phương thức thanh toán
            </h2>
            <div className="flex items-center gap-3">
              <input
                id="cod"
                type="radio"
                name="payment-method"
                value="COD"
                defaultChecked
                className="w-4 h-4"
              />
              <label htmlFor="cod" className="cursor-pointer">
                Thanh toán khi nhận hàng (COD)
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Hệ thống hiện đang hỗ trợ thanh toán COD.
            </p>
          </div>
        </div>

        {/* Right column — Order summary */}
        <div className="border rounded-lg p-6 h-fit sticky top-24">
          <h2 className="text-xl font-semibold mb-5">Tóm tắt đơn hàng</h2>
          <div className="space-y-3 mb-5">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span>
                {shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}
              </span>
            </div>
            <div className="border-t pt-4 flex justify-between text-lg font-bold">
              <span>Tổng cộng</span>
              <span className="text-red-600">
                {formatCurrency(estimatedTotal)}
              </span>
            </div>
          </div>

          <Button
            onClick={handleCheckout}
            disabled={isPending}
            className="w-full"
            size="lg"
          >
            {isPending ? "Đang xử lý..." : "Đặt hàng"}
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
  );
};
