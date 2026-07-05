import type { Metadata } from 'next';
import ClassesPage from '@/pages/ClassesPage';
import { buildMetadata } from '@/lib/metadata';
import { seoData } from '@/utils/seo';

export const metadata: Metadata = buildMetadata(seoData.classes);

const ClassesRoute = () => <ClassesPage />;

export default ClassesRoute;
