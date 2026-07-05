import Banner from '../shared/Banner';
import { Banner as BannerType } from '../../types';
import SkeletonLoading from '../shared/SkeletonLoading';

interface BannerSectionProps {
  banners: BannerType[];
  loading?: boolean;
}

const BannerSection = ({ banners, loading }: BannerSectionProps) => {
  return (
    <section aria-label="Banner quảng cáo" role="banner">
      {loading ? <SkeletonLoading type="banner" /> : <Banner banners={banners} />}
    </section>
  );
};

export default BannerSection;
