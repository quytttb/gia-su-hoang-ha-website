import type { Metadata } from 'next';
import { Suspense } from 'react';
import ClassesPage from '@/pages/ClassesPage';
import { buildMetadata } from '@/lib/metadata';
import { seoData } from '@/utils/seo';

export const metadata: Metadata = buildMetadata(seoData.classes);

const ClassesRoute = () => (
  <Suspense fallback={null}>
    <ClassesPage />
  </Suspense>
);

export default ClassesRoute;
