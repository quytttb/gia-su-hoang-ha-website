'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SettingsPage from '@/components/screens/panel/SettingsScreen';

const PanelSettingsPage = () => (
  <ProtectedRoute requiredRoles={['admin']}>
    <SettingsPage />
  </ProtectedRoute>
);

export default PanelSettingsPage;
