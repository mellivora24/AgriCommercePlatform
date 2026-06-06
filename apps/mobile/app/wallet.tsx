import React from 'react';
import { AuthGate } from '@/core/router';
import { PlaceholderScreen } from '@/presentation/screens/placeholder-screen';

export default function WalletRoute() {
  return (
    <AuthGate>
      <PlaceholderScreen
        title="Ví của tôi"
        description="Trang ví, nạp tiền và lịch sử giao dịch sẽ được nối trong giai đoạn tiếp theo."
      />
    </AuthGate>
  );
}
