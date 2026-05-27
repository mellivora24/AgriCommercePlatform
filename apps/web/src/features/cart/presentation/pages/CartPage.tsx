import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore, useAuthStore } from '@/core/store';
import { Button } from '@/shared/components/ui/Button';
import { ROUTES } from '@/core/router/routes';
import { formatCurrency, calcCartTotal } from '@/shared/utils';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, isGuest } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const total = calcCartTotal(items);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-8">Giỏ hàng của bạn đang trống</p>
        <Link to={ROUTES.PRODUCTS}>
          <Button>Mua sắm ngay!</Button>
        </Link>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
    } else {
      navigate(ROUTES.CHECKOUT);
    }
  };

  // console.log("Cart items:", items);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="border rounded-lg p-4 flex gap-4"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {item.sku}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.quantity + 1,
                          )
                        }
                      >
                        +
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.price)} each
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => removeItem(item.productId)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-20">
            <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h2>

            <div className="space-y-3 mb-4 pb-4 border-b">
              <div className="flex justify-between text-sm">
                <span>Tổng tiền</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Vận chuyển</span>
                <span>{formatCurrency(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Thuế</span>
                <span>{formatCurrency(0)}</span>
              </div>
            </div>

            <div className="flex justify-between font-bold mb-6 text-lg">
              <span>Số tiền cần thanh toán</span>
              <span className="text-red-600">
                {formatCurrency(total)}
              </span>
            </div>

            <Button
              fullWidth
              onClick={handleCheckout}
              className="mb-3"
            >
              {isGuest ? 'Đăng nhập để thanh toán' : 'Tiến hành thanh toán'}
            </Button>

            <Link to={ROUTES.PRODUCTS}>
              <Button fullWidth variant="ghost">
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
