import { Suspense } from 'react';
import TutorRegistrationPage from '@/components/screens/TutorRegistrationScreen';

const TutorRegistrationRoute = () => (
  <Suspense fallback={null}>
    <TutorRegistrationPage />
  </Suspense>
);

export default TutorRegistrationRoute;
