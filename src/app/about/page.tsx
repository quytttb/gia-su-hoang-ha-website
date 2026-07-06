import type { Metadata } from 'next';
import AboutScreen from '@/components/screens/AboutScreen';
import { buildMetadata } from '@/lib/metadata';
import { seoData } from '@/utils/seo';
import { getCenterInfo, getGalleryImages, getSiteAsset } from '@/data/settings';
import { getActiveTutors } from '@/data/tutors';

export const metadata: Metadata = buildMetadata(seoData.about);

const AboutRoute = async () => {
  const [centerInfo, tutors, galleryImages, headerAsset] = await Promise.all([
    getCenterInfo(),
    getActiveTutors(),
    getGalleryImages(),
    getSiteAsset('about_header'),
  ]);

  return (
    <AboutScreen
      centerInfo={centerInfo}
      tutors={tutors}
      galleryImages={galleryImages}
      headerAsset={headerAsset}
    />
  );
};

export default AboutRoute;
