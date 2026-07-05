import type { Metadata } from 'next';
import ClassRegistrationPage from '@/pages/ClassRegistrationPage';
import { hasFirebasePublicConfig } from '@/lib/env';
import classesService from '@/services/firestore/classesService';
import { convertFirestoreClass } from '@/utils/classHelpers';
import { buildMetadata } from '@/lib/metadata';
import { generateRegistrationSEO } from '@/utils/seo';

interface ClassRegistrationRouteProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({
  params,
}: ClassRegistrationRouteProps): Promise<Metadata> => {
  const { id } = await params;

  if (!hasFirebasePublicConfig) {
    return buildMetadata({
      title: 'Đăng ký lớp học - Trung tâm Gia Sư Hoàng Hà',
      description:
        'Đăng ký lớp học tại Trung tâm Gia Sư Hoàng Hà với quy trình nhanh chóng và tư vấn miễn phí.',
      canonical: `https://giasuhoangha.com/classes/${id}/register`,
    });
  }

  try {
    const result = await classesService.getById(id);
    if (result.data) {
      const classData = convertFirestoreClass(result.data);
      return buildMetadata(generateRegistrationSEO(classData.name));
    }
  } catch (error) {
    console.error('Failed to generate registration metadata:', error);
  }

  return buildMetadata({
    title: 'Đăng ký lớp học - Trung tâm Gia Sư Hoàng Hà',
    description:
      'Đăng ký lớp học tại Trung tâm Gia Sư Hoàng Hà với quy trình nhanh chóng và tư vấn miễn phí.',
    canonical: `https://giasuhoangha.com/classes/${id}/register`,
  });
};

const ClassRegistrationRoute = () => <ClassRegistrationPage />;

export default ClassRegistrationRoute;
