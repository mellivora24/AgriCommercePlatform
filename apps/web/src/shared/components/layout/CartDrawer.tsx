import React from 'react';
import { useCartStore } from '@/core/store';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/core/router/routes';
import { formatCurrency, calcCartTotal } from '../../utils';
import { X, ShoppingCart, Trash2, LogIn, ShoppingBag, Plus, Minus } from 'lucide-react';
import type { CartItem } from '@/core/store';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { items, guestItems, removeItem, updateQuantity, isGuest } = useCartStore();
  const displayItems = isGuest ? guestItems : items;
  const total = calcCartTotal(displayItems as CartItem[]);

  const handleCheckout = () => {
    navigate(isGuest ? ROUTES.LOGIN : ROUTES.CHECKOUT);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-green-600" />
            <h2 className="text-base font-bold text-gray-900">Giỏ hàng</h2>
            {displayItems.length > 0 && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                {displayItems.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Guest banner */}
        {isGuest && (
          <div className="mx-4 mt-3 flex items-center gap-2.5 rounded-xl bg-amber-50 px-3.5 py-2.5 text-sm text-amber-700 border border-amber-100">
            <LogIn className="h-4 w-4 flex-shrink-0" />
            <span>Đăng nhập để lưu giỏ hàng và thanh toán</span>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {displayItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                <ShoppingCart className="h-7 w-7 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500">Giỏ hàng trống</p>
              <p className="mt-1 text-xs text-gray-400">Thêm sản phẩm để bắt đầu</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {displayItems.map((item: any) => (
                <div
                  key={item.productId}
                  className="group flex gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3 transition hover:border-green-100 hover:bg-green-50/30"
                >
                  <img
                    src={item.image || '/placeholder.png'}
                    alt={item.name}
                    className="h-14 w-14 flex-shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p className="truncate text-sm font-semibold text-gray-800">{item.name}</p>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="flex-shrink-0 rounded-md p-1 text-gray-300 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      {/* Quantity */}
                      <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white p-0.5">
                        <button
                          onClick={() =>
                            item.quantity <= 1
                              ? removeItem(item.productId)
                              : updateQuantity?.(item.productId, item.quantity - 1)
                          }
                          className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-red-500"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-gray-700">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity?.(item.productId, item.quantity + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-green-600"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-green-700">
                        {formatCurrency(Number(item.price) * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-5 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Tổng cộng</span>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(total)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={displayItems.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 py-2.5 text-sm font-bold text-white shadow-md shadow-green-200 transition hover:brightness-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGuest ? (
              <>
                <LogIn className="h-4 w-4" />
                Đăng nhập để thanh toán
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                Thanh toán
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-sm text-gray-400 transition hover:text-green-600"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </>
  );
};
