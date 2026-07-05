import type { Metadata } from 'next';
import HomePage from '@/pages/HomePage';
import { buildMetadata } from '@/lib/metadata';
import { seoData } from '@/utils/seo';

export const metadata: Metadata = buildMetadata(seoData.home);

const HomeRoute = () => <HomePage />;

export default HomeRoute;
