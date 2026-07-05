import { Suspense } from 'react';
import LoginPage from '@/pages/LoginPage';

const LoginRoute = () => (
  <Suspense fallback={null}>
    <LoginPage />
  </Suspense>
);

export default LoginRoute;
