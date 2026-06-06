import React from 'react';
import { GuestGate } from '@/core/router';
import { RegisterScreen } from '@/presentation/screens/auth/register-screen';

export default function RegisterRoute() {
  return (
    <GuestGate>
      <RegisterScreen />
    </GuestGate>
  );
}
