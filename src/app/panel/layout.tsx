'use client';

import PanelLayout from '@/components/panel/layout/PanelLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface PanelRouteLayoutProps {
  children: React.ReactNode;
}

const PanelRouteLayout = ({ children }: PanelRouteLayoutProps) => (
  <ProtectedRoute requiredRoles={['admin', 'staff']}>
    <PanelLayout>{children}</PanelLayout>
  </ProtectedRoute>
);

export default PanelRouteLayout;
