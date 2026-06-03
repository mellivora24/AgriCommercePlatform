import React from 'react';
import { AuthGate } from '@/core/router';
import { PlaceholderScreen } from '@/presentation/screens/placeholder-screen';
import { useRouter } from 'expo-router';
import { ROUTES } from '@/core/router';

export default function OrdersRoute() {
  const router = useRouter();

  return (
    <AuthGate>
      <PlaceholderScreen
        title="Đơn hàng"
        description="Danh sách đơn hàng sẽ được kết nối từ API ở bước tiếp theo."
        actionLabel="Về trang chủ"
        onActionPress={() => router.replace(ROUTES.HOME_PAGE)}
      />
    </AuthGate>
  );
}
