import React from 'react';
import { AuthGate } from '@/core/router';
import OrderDetailScreen from '@/presentation/screens/order/order-detail';

export default function OrderDetailRoute() {
  return (
    <AuthGate>
      <OrderDetailScreen />
    </AuthGate>
  );
}
