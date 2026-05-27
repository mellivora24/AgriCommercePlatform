import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PaymentMethod } from '../../domain/entities/order.entity';
import { useCreateOrder } from '../hooks/useOrders';
import { useCartStore } from '@/core/store/cart.store';
import { useAuthStore } from '@/core/store/auth.store';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { useToast } from '@/shared/hooks/useToast';
import { ROUTES } from '@/core/router/routes';
import { formatCurrency } from '@/shared/utils/format';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const toast = useToast();
  const { mutate: createOrder, isPending } = useCreateOrder();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [shippingAddressId, setShippingAddressId] = useState('');
  const [notes, setNotes] = useState('');

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="mb-4">You must be logged in to checkout</p>
          <Button onClick={() => navigate(ROUTES.LOGIN)}>Login to Continue</Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="mb-4">Your cart is empty</p>
          <Button onClick={() => navigate(ROUTES.PRODUCTS)}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 30000;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + shippingFee + tax;

  const handleCheckout = () => {
    if (!shippingAddressId) {
      toast.error('Please select a shipping address');
      return;
    }

    createOrder(
      {
        items: items.map(item => ({
          productId: item.productId,
          sellerId: item.sellerId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || '',
          sku: item.sku || '',
        })),
        shippingAddressId,
        paymentMethod,
        notes,
      },
      {
        onSuccess: order => {
          clearCart();
          toast.success('Order created successfully');
          navigate(`${ROUTES.ORDERS}/${order.id}`);
        },
        onError: error => {
          toast.error(error instanceof Error ? error.message : 'Failed to create order');
        },
      },
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="col-span-2 space-y-8">
          {/* Shipping Address */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <Input
              label="Shipping Address ID"
              value={shippingAddressId}
              onChange={e => setShippingAddressId(e.target.value)}
              placeholder="Enter or select a shipping address"
            />
            <p className="text-sm text-gray-500 mt-2">(TODO: Integrate address book from buyer profile)</p>
          </div>

          {/* Order Items */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {items.map(item => (
                <div key={`${item.productId}-${item.sellerId}`} className="flex gap-4 pb-4 border-b">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                    <p className="text-sm">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                    <p className="text-sm text-gray-500">{formatCurrency(item.price)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="space-y-3">
              {(['credit_card', 'debit_card', 'bank_transfer', 'wallet'] as const).map(method => (
                <label key={method} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-4 h-4"
                  />
                  <span className="capitalize">{method.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Order Notes</h2>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add any special instructions or notes (optional)"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={4}
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="border rounded-lg p-6 h-fit sticky top-4">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatCurrency(shippingFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-red-600">{formatCurrency(total)}</span>
            </div>
          </div>
          <Button onClick={handleCheckout} disabled={isPending} className="w-full" variant="primary" size="lg">
            {isPending ? 'Processing...' : 'Place Order'}
          </Button>
          <Button
            onClick={() => navigate(ROUTES.CART)}
            disabled={isPending}
            className="w-full mt-2"
            variant="ghost"
            size="lg"
          >
            Back to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};
