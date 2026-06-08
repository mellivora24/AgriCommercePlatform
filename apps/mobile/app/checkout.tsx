import React from 'react';
import { AuthGate } from '@/core/router';
import CheckoutScreen from '@/presentation/screens/order/checkout-screen';

export default function CheckoutRoute() {
  return (
    <AuthGate>
      <CheckoutScreen />
    </AuthGate>
  );
}
