import React from 'react';
import { AuthGate } from '@/core/router';
import { PlaceholderScreen } from '@/presentation/screens/placeholder-screen';

export default function CheckoutRoute() {
  return (
    <AuthGate>
      <PlaceholderScreen
        title="Thanh toán"
        description="Luồng checkout sẽ được nối sang order/payment API ở bước tiếp theo."
      />
    </AuthGate>
  );
}
