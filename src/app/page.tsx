import type { Metadata } from 'next';
import HomeScreen from '@/components/screens/HomeScreen';
import { buildMetadata } from '@/lib/metadata';
import { seoData } from '@/utils/seo';
import { getActiveBanners } from '@/data/banners';
import { getCenterInfo } from '@/data/settings';
import { getActiveClasses } from '@/data/classes';
import { getFeaturedClasses } from '@/utils/classHelpers';

export const metadata: Metadata = buildMetadata(seoData.home);

const HomeRoute = async () => {
  const [banners, centerInfo, classes] = await Promise.all([
    getActiveBanners(),
    getCenterInfo(),
    getActiveClasses(),
  ]);

  return (
    <HomeScreen
      banners={banners}
      centerInfo={centerInfo}
      featuredClasses={getFeaturedClasses(classes, 6)}
    />
  );
};

export default HomeRoute;
