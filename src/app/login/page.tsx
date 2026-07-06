import { Suspense } from 'react';
import LoginPage from '@/components/screens/LoginScreen';

const LoginRoute = () => (
  <Suspense fallback={null}>
    <LoginPage />
  </Suspense>
);

export default LoginRoute;
