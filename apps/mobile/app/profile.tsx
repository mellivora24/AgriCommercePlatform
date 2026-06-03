import React from 'react';
import { AuthGate } from '@/core/router';
import { PlaceholderScreen } from '@/presentation/screens/placeholder-screen';

export default function ProfileRoute() {
  return (
    <AuthGate>
      <PlaceholderScreen
        title="Hồ sơ"
        description="Trang hồ sơ người mua sẽ bao gồm địa chỉ, wishlist, wallet, và cấu hình tài khoản."
      />
    </AuthGate>
  );
}
