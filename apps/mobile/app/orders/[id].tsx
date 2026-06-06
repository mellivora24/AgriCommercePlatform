import React from 'react';
import { AuthGate } from '@/core/router';
import { PlaceholderScreen } from '@/presentation/screens/placeholder-screen';

export default function OrderDetailRoute() {
  return (
    <AuthGate>
      <PlaceholderScreen
        title="Chi tiết đơn hàng"
        description="Màn hình chi tiết đơn hàng sẽ hiển thị tiến trình, thanh toán, và vận chuyển."
      />
    </AuthGate>
  );
}
