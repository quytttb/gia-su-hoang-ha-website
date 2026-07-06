import type { Metadata } from 'next';
import { Suspense } from 'react';
import ClassesScreen from '@/components/screens/ClassesScreen';
import { buildMetadata } from '@/lib/metadata';
import { seoData } from '@/utils/seo';
import { getActiveClasses } from '@/data/classes';

export const metadata: Metadata = buildMetadata(seoData.classes);

const ClassesRoute = async () => {
  const classes = await getActiveClasses();

  return (
    <Suspense fallback={null}>
      <ClassesScreen initialClasses={classes} />
    </Suspense>
  );
};

export default ClassesRoute;
