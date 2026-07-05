import { Suspense } from 'react';
import TutorRegistrationPage from '@/pages/TutorRegistrationPage';

const TutorRegistrationRoute = () => (
  <Suspense fallback={null}>
    <TutorRegistrationPage />
  </Suspense>
);

export default TutorRegistrationRoute;
