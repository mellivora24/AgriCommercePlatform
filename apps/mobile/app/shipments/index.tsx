import React from 'react';
import { AuthGate } from '@/core/router';
import { PlaceholderScreen } from '@/presentation/screens/placeholder-screen';

export default function ShipmentsRoute() {
  return (
    <AuthGate>
      <PlaceholderScreen
        title="Vận chuyển"
        description="Danh sách đơn vận chuyển và trạng thái shipper sẽ được hoàn thiện tiếp theo."
      />
    </AuthGate>
  );
}
