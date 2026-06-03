import React from 'react';
import { AuthGate } from '@/core/router';
import { CartScreen } from '@/presentation/screens/cart-screen';

export default function CartRoute() {
  return (
    <AuthGate>
      <CartScreen />
    </AuthGate>
  );
}
