import React from 'react';
import { GuestGate } from '@/core/router';
import { LoginScreen } from '@/presentation/screens/auth/login-screen';

export default function LoginRoute() {
  return (
    <GuestGate>
      <LoginScreen />
    </GuestGate>
  );
}
