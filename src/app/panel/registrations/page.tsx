import { Suspense } from 'react';
import RegistrationsPage from '@/components/screens/panel/RegistrationsScreen';

const PanelRegistrationsRoute = () => (
  <Suspense fallback={null}>
    <RegistrationsPage />
  </Suspense>
);

export default PanelRegistrationsRoute;
