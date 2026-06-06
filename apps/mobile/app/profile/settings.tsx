import React from 'react';
import { AuthGate } from '@/core/router';
import { PlaceholderScreen } from '@/presentation/screens/placeholder-screen';

export default function ProfileSettingsRoute() {
  return (
    <AuthGate>
      <PlaceholderScreen title="Cài đặt hồ sơ" description="Cài đặt tài khoản sẽ được hoàn thiện sau." />
    </AuthGate>
  );
}
