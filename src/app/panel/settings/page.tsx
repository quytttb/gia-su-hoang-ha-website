'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SettingsPage from '@/pages/panel/SettingsPage';

const PanelSettingsPage = () => (
  <ProtectedRoute requiredRoles={['admin']}>
    <SettingsPage />
  </ProtectedRoute>
);

export default PanelSettingsPage;
