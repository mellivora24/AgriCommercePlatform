import React from 'react';
import { AuthGate } from '@/core/router';
import { PlaceholderScreen } from '@/presentation/screens/placeholder-screen';

export default function ProfileAddressesRoute() {
  return (
    <AuthGate>
      <PlaceholderScreen title="Địa chỉ giao hàng" description="Danh sách địa chỉ sẽ được nối từ API người mua." />
    </AuthGate>
  );
}
