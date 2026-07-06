'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import StaffPage from '@/components/screens/panel/StaffScreen';

const PanelStaffPage = () => (
  <ProtectedRoute requiredRoles={['admin']}>
    <StaffPage />
  </ProtectedRoute>
);

export default PanelStaffPage;
