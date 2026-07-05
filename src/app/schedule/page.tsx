import type { Metadata } from 'next';
import SchedulePage from '@/pages/SchedulePage';
import { buildMetadata } from '@/lib/metadata';
import { seoData } from '@/utils/seo';

export const metadata: Metadata = buildMetadata(seoData.schedule);

const ScheduleRoute = () => <SchedulePage />;

export default ScheduleRoute;
