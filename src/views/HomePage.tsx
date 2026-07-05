'use client';

import { useEffect, useState, Suspense, lazy } from 'react';
import Layout from '../components/layout/Layout';
import { Banner as BannerType, CenterInfo, Class } from '../types';
import { bannerService } from '../services/bannerService';
import classesService from '../services/firestore/classesService';
import settingsService from '../services/firestore/settingsService';
import { convertFirestoreClass, getFeaturedClasses } from '../utils/classHelpers';
import ErrorDisplay from '../components/shared/ErrorDisplay';
import BlogSection from '../components/home/BlogSection';
import BannerSection from '../components/home/BannerSection';
import IntroductionSection from '../components/home/IntroductionSection';
import FeaturedClassesSection from '../components/home/FeaturedClassesSection';
import ContactCTASection from '../components/home/ContactCTASection';
import ParentFeedbackSection from '../components/home/ParentFeedbackSection';

const Chatbot = lazy(() => import('../components/shared/Chatbot'));

const HomePage = () => {
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [centerInfo, setCenterInfo] = useState<CenterInfo | null>(null);
  const [featuredClasses, setFeaturedClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to scroll to section
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

  // Handle scroll to section when page loads with hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && !loading) {
      const sectionId = hash.replace('#', '');
      scrollToSection(sectionId);
    }
  }, [loading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch banners và center info song song
        const [bannersResult, centerInfoResult] = await Promise.all([
          bannerService.getActiveBanners(),
          settingsService.getCenterInfo(),
        ]);
        setBanners(bannersResult);
        setCenterInfo(centerInfoResult);

        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching home page data:', error);
        setError(error.message || 'Không thể tải dữ liệu trang chủ');
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time listener for featured classes
    const unsubscribe = classesService.subscribeToActiveClasses(firestoreClasses => {
      try {
        const classesData = firestoreClasses.map(convertFirestoreClass);
        const featuredOnly = getFeaturedClasses(classesData, 6); // Limit to 6 featured classes
        setFeaturedClasses(featuredOnly);
      } catch (error: any) {
        console.error('Error processing classes:', error);
        setError(error.message || 'Không thể xử lý danh sách lớp học');
      }
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <Layout>
        <BannerSection banners={[]} loading />
        <IntroductionSection
          centerInfo={{
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
          }}
          loading
        />
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
        <ErrorDisplay message="Không thể tải dữ liệu" details={error} retryLabel="Thử lại" />
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
      {/* Đối tác của chúng tôi */}
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
