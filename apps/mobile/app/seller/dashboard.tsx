import React from 'react';
import { RoleGate } from '@/core/router';
import { UserRole } from '@/core/types/enum';
import { SellerDashboardScreen } from '@/presentation/screens/seller-dashboard-screen';

export default function SellerDashboardRoute() {
  return (
    <RoleGate allowedRoles={[UserRole.SELLER]}>
      <SellerDashboardScreen />
    </RoleGate>
  );
}
