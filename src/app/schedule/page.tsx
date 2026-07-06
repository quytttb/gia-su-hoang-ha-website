import type { Metadata } from 'next';
import SchedulePage from '@/components/screens/ScheduleScreen';
import { buildMetadata } from '@/lib/metadata';
import { seoData } from '@/utils/seo';

export const metadata: Metadata = buildMetadata(seoData.schedule);

const ScheduleRoute = () => <SchedulePage />;

export default ScheduleRoute;
