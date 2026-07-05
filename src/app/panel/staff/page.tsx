'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import StaffPage from '@/pages/panel/StaffPage';

const PanelStaffPage = () => (
  <ProtectedRoute requiredRoles={['admin']}>
    <StaffPage />
  </ProtectedRoute>
);

export default PanelStaffPage;
