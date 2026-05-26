import React from 'react';
import { useCartStore } from '../../../core/store';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../core/router/routes';
import { Button } from '../ui/Button';
import { formatCurrency, calcCartTotal } from '../../utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const { items, removeItem, isGuest } = useCartStore();

  const total = calcCartTotal(items);

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (isGuest) {
      navigate(ROUTES.LOGIN);
    } else {
      navigate(ROUTES.CHECKOUT);
    }
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 flex flex-col">
        <div className="border-b p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {items.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Your cart is empty
            </p>
          ) : (
            <div className="space-y-4">
              {items.map((item: any) => (
                <div
                  key={item.productId}
                  className="border rounded p-3"
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">{item.name}</h3>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{item.quantity}x</span>
                    <span>{formatCurrency(item.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t p-4 space-y-3">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <Button
            fullWidth
            onClick={handleCheckout}
            disabled={items.length === 0}
          >
            {isGuest ? 'Login to Checkout' : 'Checkout'}
          </Button>
        </div>
      </div>
    </>
  );
};
