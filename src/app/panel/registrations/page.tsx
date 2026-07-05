import { Suspense } from 'react';
import RegistrationsPage from '@/pages/panel/RegistrationsPage';

const PanelRegistrationsRoute = () => (
  <Suspense fallback={null}>
    <RegistrationsPage />
  </Suspense>
);

export default PanelRegistrationsRoute;
