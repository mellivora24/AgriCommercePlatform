import React from 'react';
import { GuestGate } from '@/core/router';
import { PlaceholderScreen } from '@/presentation/screens/placeholder-screen';

export default function ForgotPasswordRoute() {
  return (
    <GuestGate>
      <PlaceholderScreen
        title="Quên mật khẩu"
        description="Màn hình lấy lại mật khẩu sẽ được hoàn thiện khi API khôi phục mật khẩu sẵn sàng."
      />
    </GuestGate>
  );
}
