import React from 'react';
import { RoleGate } from '@/core/router';
import { UserRole } from '@/core/types/enum';
import { ShipperDashboardScreen } from '@/presentation/screens/shipper-dashboard-screen';

export default function ShipperDashboardRoute() {
  return (
    <RoleGate allowedRoles={[UserRole.SHIPPER]}>
      <ShipperDashboardScreen />
    </RoleGate>
  );
}
