import React from 'react';
import { RoleGate } from '@/core/router';
import { UserRole } from '@/core/types/enum';
import { AdminDashboardScreen } from '@/presentation/screens/admin-dashboard-screen';

export default function AdminDashboardRoute() {
  return (
    <RoleGate allowedRoles={[UserRole.ADMIN]}>
      <AdminDashboardScreen />
    </RoleGate>
  );
}
