import type { Metadata } from 'next';
import ClassDetailScreen from '@/components/screens/ClassDetailScreen';
import { hasSupabaseConfig } from '@/lib/env';
import { getClassById } from '@/data/classes';
import { getSchedulesByClassId } from '@/data/schedules';
import { buildMetadata } from '@/lib/metadata';
import { generateClassSEO, seoData } from '@/utils/seo';

interface ClassDetailRouteProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({ params }: ClassDetailRouteProps): Promise<Metadata> => {
  const { id } = await params;

  if (!hasSupabaseConfig) {
    return buildMetadata(seoData.classes);
  }

  try {
    const classData = await getClassById(id);
    if (classData) {
      return buildMetadata(generateClassSEO(classData.name, classData.description, id));
    }
  } catch (error) {
    console.error('Failed to generate class metadata:', error);
  }

  return buildMetadata(seoData.classes);
};

const ClassDetailRoute = async ({ params }: ClassDetailRouteProps) => {
  const { id } = await params;
  const [course, schedules] = await Promise.all([getClassById(id), getSchedulesByClassId(id)]);

  return <ClassDetailScreen course={course} schedules={schedules} />;
};

export default ClassDetailRoute;
