import type { Metadata } from 'next';
import AboutPage from '@/pages/AboutPage';
import { buildMetadata } from '@/lib/metadata';
import { seoData } from '@/utils/seo';

export const metadata: Metadata = buildMetadata(seoData.about);

const AboutRoute = () => <AboutPage />;

export default AboutRoute;
