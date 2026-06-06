import React from 'react';
import { AuthGate } from '@/core/router';
import { PlaceholderScreen } from '@/presentation/screens/placeholder-screen';

export default function ReturnsRoute() {
  return (
    <AuthGate>
      <PlaceholderScreen
        title="Trả hàng"
        description="Luồng yêu cầu trả hàng sẽ bám theo API và quy trình duyệt của web."
      />
    </AuthGate>
  );
}
