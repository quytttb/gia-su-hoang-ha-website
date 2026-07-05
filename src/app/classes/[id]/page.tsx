import type { Metadata } from 'next';
import ClassDetailPage from '@/pages/ClassDetailPage';
import { hasFirebasePublicConfig } from '@/lib/env';
import classesService from '@/services/firestore/classesService';
import { convertFirestoreClass } from '@/utils/classHelpers';
import { buildMetadata } from '@/lib/metadata';
import { generateClassSEO, seoData } from '@/utils/seo';

interface ClassDetailRouteProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({ params }: ClassDetailRouteProps): Promise<Metadata> => {
  const { id } = await params;

  if (!hasFirebasePublicConfig) {
    return buildMetadata(seoData.classes);
  }

  try {
    const result = await classesService.getById(id);
    if (result.data) {
      const classData = convertFirestoreClass(result.data);
      return buildMetadata(generateClassSEO(classData.name, classData.description, id));
    }
  } catch (error) {
    console.error('Failed to generate class metadata:', error);
  }

  return buildMetadata(seoData.classes);
};

const ClassDetailRoute = () => <ClassDetailPage />;

export default ClassDetailRoute;
