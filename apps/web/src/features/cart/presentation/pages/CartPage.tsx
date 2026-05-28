import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart, Trash2, Plus, Minus,
  ArrowLeft, ShoppingBag, Loader2,
} from "lucide-react";

import {
  useGetCart,
  useUpdateCartItem,
  useRemoveFromCart,
} from "@/features/cart/presentation/hooks/useCart";
import { formatCurrency } from "@/shared/utils";
import { ROUTES } from "@/core/router/routes";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CartItem {
  itemId: number;
  productId: number;
  quantity: number;
  product: {
    productId: number;
    name: string;
    price: string;
    images?: { imageUrl: string }[];
    stockQuantity: number;
    seller: { storeName: string };
  };
}

// ─── QuantityControl ──────────────────────────────────────────────────────────
const QuantityControl: React.FC<{
  itemId: number;
  productId: number;
  quantity: number;
  max: number;
}> = ({ itemId, productId, quantity, max }) => {
  const update = useUpdateCartItem();
  const remove = useRemoveFromCart();
  const isPending = update.isPending || remove.isPending;

  useEffect(() => {
    console.log('[CartPage] QuantityControl mounted for product:', productId);
  }, [productId]);

  const handleChange = (delta: number) => {
    const next = quantity + delta;
    if (next < 1) remove.mutate({ itemId });
    else update.mutate({ productId, quantity: next });
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white p-0.5">
      <button
        onClick={() => handleChange(-1)}
        disabled={isPending}
        className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-red-500 disabled:opacity-40"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-8 text-center text-sm font-bold text-gray-800">
        {isPending
          ? <Loader2 className="mx-auto h-3.5 w-3.5 animate-spin text-green-500" />
          : quantity}
      </span>
      <button
        onClick={() => handleChange(1)}
        disabled={isPending || quantity >= max}
        className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-green-600 disabled:opacity-40"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

// ─── CartItemRow ──────────────────────────────────────────────────────────────
const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
  const remove = useRemoveFromCart();
  const navigate = useNavigate();
  const subtotal = Number(item.product.price) * item.quantity;

  return (
    <div className="group flex gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition hover:border-green-100 hover:bg-green-50/30">
      {/* Image */}
      <button
        onClick={() => navigate(`/products/${item.product.productId}`)}
        className="flex-shrink-0"
      >
        <img
          src={item.product.images?.[0]?.imageUrl || "/placeholder.png"}
          alt={item.product.name}
          className="h-20 w-20 rounded-xl object-cover"
        />
      </button>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <button
              onClick={() => navigate(`/products/${item.product.productId}`)}
              className="text-left text-sm font-semibold text-gray-800 hover:text-green-700 line-clamp-2"
            >
              {item.product.name}
            </button>
            <p className="mt-0.5 truncate text-xs text-gray-400">
              {item.product.seller.storeName}
            </p>
          </div>
          <button
            onClick={() => remove.mutate({ itemId: item.itemId })}
            disabled={remove.isPending}
            className="flex-shrink-0 rounded-lg p-1.5 text-gray-300 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <QuantityControl
            itemId={item.itemId}
            productId={item.productId}
            quantity={item.quantity}
            max={item.product.stockQuantity}
          />
          <div className="text-right">
            <p className="text-xs text-gray-400">
              {formatCurrency(Number(item.product.price))} × {item.quantity}
            </p>
            <p className="text-sm font-bold text-green-700">
              {formatCurrency(subtotal)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyCart: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
        <ShoppingCart className="h-9 w-9 text-gray-300" />
      </div>
      <h2 className="mb-1.5 text-lg font-bold text-gray-700">Giỏ hàng trống</h2>
      <p className="mb-6 text-sm text-gray-400">Thêm sản phẩm để bắt đầu mua sắm nhé!</p>
      <button
        onClick={() => navigate(ROUTES.PRODUCTS ?? "/products")}
        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-green-200 transition hover:brightness-105 active:scale-95"
      >
        <ShoppingBag className="h-4 w-4" />
        Khám phá sản phẩm
      </button>
    </div>
  );
};

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    console.log('[CartPage] Component mounted - fetching cart data');
  }, []);

  useEffect(() => {
    console.log('[CartPage] Cart state:', { isLoading, isError, data });
  }, [isLoading, isError, data]);

  const items: CartItem[] = (data as any)?.items ?? [];
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce(
    (s, i) => s + Number(i.product.price) * i.quantity, 0,
  );

  const handleCheckout = () => {
    setIsCheckingOut(true);
    navigate("/checkout");
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8 h-8 w-36 animate-pulse rounded-lg bg-gray-100" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
          <div className="h-52 animate-pulse rounded-xl bg-gray-100" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm text-gray-500">Không thể tải giỏ hàng. Vui lòng thử lại.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-7 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:border-green-300 hover:bg-green-50 hover:text-green-700"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Giỏ hàng</h1>
          {items.length > 0 && (
            <p className="text-sm text-gray-400">{totalItems} sản phẩm</p>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Items */}
          <div className="space-y-3 lg:col-span-2">
            {items.map((item) => (
              <CartItemRow key={item.itemId} item={item} />
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-bold text-gray-800">Tóm tắt đơn hàng</h2>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Tạm tính ({totalItems} sp)</span>
                  <span className="font-medium text-gray-700">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-green-600">Miễn phí</span>
                </div>
                <div className="my-2 border-t border-dashed border-gray-100" />
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800">Tổng cộng</span>
                  <span className="text-base font-bold text-green-700">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 py-2.5 text-sm font-bold text-white shadow-md shadow-green-200 transition hover:brightness-105 active:scale-95 disabled:opacity-60"
              >
                {isCheckingOut
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <ShoppingBag className="h-4 w-4" />
                }
                Tiến hành thanh toán
              </button>

              <button
                onClick={() => navigate(ROUTES.PRODUCTS ?? "/products")}
                className="mt-2.5 w-full py-2 text-sm text-gray-400 transition hover:text-green-600"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
