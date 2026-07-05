'use client';

import { useEffect, useMemo, Suspense, lazy } from 'react';
import Layout from '../components/layout/Layout';
import { Class } from '../types';
import ErrorDisplay from '../components/shared/ErrorDisplay';
import BlogSection from '../components/home/BlogSection';
import BannerSection from '../components/home/BannerSection';
import IntroductionSection from '../components/home/IntroductionSection';
import FeaturedClassesSection from '../components/home/FeaturedClassesSection';
import ContactCTASection from '../components/home/ContactCTASection';
import ParentFeedbackSection from '../components/home/ParentFeedbackSection';
import { convertFirestoreClass, getFeaturedClasses } from '../utils/classHelpers';
import { useActiveBanners } from '@/hooks/useBanners';
import { useCenterInfo } from '@/hooks/useCenterInfo';
import { useActiveClasses } from '@/hooks/useClasses';

const Chatbot = lazy(() => import('../components/shared/Chatbot'));

const EMPTY_CENTER_INFO = {
  id: '',
  name: '',
  description: '',
  address: '',
  phone: '',
  email: '',
  history: '',
  mission: '',
  vision: '',
  slogan: '',
  workingHours: { weekdays: '', weekend: '' },
};

const HomePage = () => {
  const {
    data: banners = [],
    isLoading: bannersLoading,
    error: bannersError,
    refetch: refetchBanners,
  } = useActiveBanners();
  const { data: centerInfo = null, isLoading: centerLoading, error: centerError } = useCenterInfo();
  const { data: firestoreClasses = [] } = useActiveClasses();

  const featuredClasses = useMemo<Class[]>(
    () => getFeaturedClasses(firestoreClasses.map(convertFirestoreClass), 6),
    [firestoreClasses]
  );

  const loading = bannersLoading || centerLoading;
  const error = bannersError?.message || centerError?.message || null;

  const scrollToSection = (sectionId: string) => {
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      }
    }, 100);
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && !loading) {
      scrollToSection(hash.replace('#', ''));
    }
  }, [loading]);

  if (loading) {
    return (
      <Layout>
        <BannerSection banners={[]} loading />
        <IntroductionSection centerInfo={EMPTY_CENTER_INFO} loading />
        <FeaturedClassesSection featuredClasses={[]} loading />
        <div className="section-padding" />
        <ContactCTASection />
        <ParentFeedbackSection loading />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorDisplay
          message="Không thể tải dữ liệu"
          details={error}
          onRetry={() => refetchBanners()}
          retryLabel="Thử lại"
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div id="banner">
        <BannerSection banners={banners} />
      </div>
      <div id="introduction">{centerInfo && <IntroductionSection centerInfo={centerInfo} />}</div>
      <div id="featured-classes">
        <FeaturedClassesSection featuredClasses={featuredClasses} />
      </div>
      <div id="blog">
        <BlogSection />
      </div>
      <div id="feedback">
        <ParentFeedbackSection />
      </div>
      <div id="contact">
        <ContactCTASection />
      </div>
      <section className="section-padding bg-white dark:bg-gray-900" id="partners">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-center mb-6 text-primary-700 dark:text-primary-400 uppercase">
            Đối tác của chúng tôi
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-24 mt-8">
            <img
              src="/images/partners/lam_son.png"
              alt="THPT Chuyên Lam Sơn"
              width={180}
              height={112}
              className="h-20 md:h-28 object-contain max-w-[180px]"
            />
            <img
              src="/images/partners/dao_duy_tu.png"
              alt="THPT Đào Duy Từ"
              width={180}
              height={112}
              className="h-20 md:h-28 object-contain max-w-[180px]"
            />
            <img
              src="/images/partners/ham_rong.png"
              alt="THPT Hàm Rồng"
              width={180}
              height={112}
              className="h-20 md:h-28 object-contain max-w-[180px]"
            />
            <img
              src="/images/partners/tran_mai_ninh.png"
              alt="THCS Trần Mai Ninh"
              width={180}
              height={112}
              className="h-20 md:h-28 object-contain max-w-[180px]"
            />
          </div>
        </div>
      </section>
      <Suspense fallback={null}>
        <Chatbot />
      </Suspense>
    </Layout>
  );
};

export default HomePage;
