'use client';

import { useCallback, useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { CenterInfo } from '../types';
import Chatbot from '../components/shared/Chatbot';
import ErrorDisplay from '../components/shared/ErrorDisplay';
import SkeletonLoading from '../components/shared/SkeletonLoading';
import AboutIntroSection from '../components/about/AboutIntroSection';
import AboutHistorySection from '../components/about/AboutHistorySection';
import AboutVisionSection from '../components/about/AboutVisionSection';
import AboutMissionSection from '../components/about/AboutMissionSection';
import AboutServicesSection from '../components/about/AboutServicesSection';
import AboutTeamSection from '../components/about/AboutTeamSection';
import AboutGallerySection from '../components/about/AboutGallerySection';
import AboutLetterSection from '../components/about/AboutLetterSection';
import { useCenterInfo } from '@/hooks/useCenterInfo';
import { useTutors } from '@/hooks/useTutors';

const DEFAULT_CENTER_INFO: CenterInfo = {
  id: '1',
  name: 'Trung tâm Gia Sư Hoàng Hà',
  description:
    'Trung tâm Gia Sư Hoàng Hà tự hào là nơi cung cấp dịch vụ gia sư chất lượng cao tại Thanh Hóa.',
  address: '265 - ĐƯỜNG 06 - MẶT BẰNG 08, PHƯỜNG NAM NGẠN, THÀNH PHỐ THANH HOÁ, TỈNH THANH HOÁ',
  phone: '0385.510.892 - 0962.390.161',
  email: 'giasuhoangha.tpth@gmail.com',
  history:
    'Trung tâm Gia sư Hoàng Hà ra đời từ tâm huyết của Nhà sáng lập Nguyễn Nguyên Hoàng – tốt nghiệp chuyên ngành Quản trị Kinh doanh thuộc Trường Đại học Mở Hà Nội, một người trẻ lớn lên trong gia đình có truyền thống giáo dục lâu đời và nhiều thế hệ tại vùng đất Thạch Thành, Thanh Hoá. Không chỉ thấm nhuần những giá trị sâu sắc về giáo dục từ trong chính ngôi nhà của mình, anh còn dành nhiều năm gắn bó trực tiếp với nghề gia sư trong suốt thời sinh viên. Chính những trải nghiệm đó đã hình thành nên lý tưởng giáo dục của Hoàng Hà, xây dựng một môi trường học tập gần gũi, niềm tin và giàu cảm hứng, nơi học sinh được quan tâm như chính người thân trong gia đình.',
  mission:
    'Sứ mệnh của chúng tôi là cung cấp môi trường học tập chất lượng, hiệu quả, giúp học sinh phát triển toàn diện về kiến thức và kỹ năng sống.',
  vision:
    'Trở thành trung tâm gia sư hàng đầu tại Thanh Hóa, mang đến giải pháp giáo dục toàn diện cho học sinh các cấp.',
  slogan: 'DẪN LỐI TRI THỨC - VỮNG BƯỚC TƯƠNG LAI',
  workingHours: {
    weekdays: '7:30 - 20:00',
    weekend: '8:00 - 17:00',
  },
};

const AboutPage = () => {
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const {
    data: centerInfoData,
    isLoading: centerLoading,
    error: centerError,
    refetch: refetchCenterInfo,
  } = useCenterInfo();
  const { data: tutors = [], error: tutorsError } = useTutors(true);

  const centerInfo = centerInfoData ?? (centerError ? DEFAULT_CENTER_INFO : null);
  const loading = centerLoading;
  const partialError = centerError?.message || tutorsError?.message || null;

  const scrollToSection = useCallback((sectionId: string) => {
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }
    }, 100);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && !loading) {
      scrollToSection(hash.replace('#', ''));
    }
  }, [loading, scrollToSection]);

  if (loading) {
    return (
      <Layout>
        <div className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-16">
              <SkeletonLoading type="text" count={2} className="mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
              <SkeletonLoading type="text" count={4} />
              <SkeletonLoading type="text" count={4} />
            </div>
            <SkeletonLoading type="text" count={5} />
          </div>
        </div>
      </Layout>
    );
  }

  if (!centerInfo) {
    return (
      <Layout>
        <ErrorDisplay
          message="Không thể tải thông tin trung tâm"
          details="Vui lòng thử lại sau hoặc liên hệ với chúng tôi qua số điện thoại: 0385.510.892"
          onRetry={() => refetchCenterInfo()}
          retryLabel="Thử lại"
        />
      </Layout>
    );
  }

  return (
    <Layout>
      {partialError && (
        <div className="container-custom my-4">
          <ErrorDisplay
            message="Thông báo"
            details="Một số dữ liệu có thể chưa được tải đầy đủ. Đang sử dụng thông tin mặc định."
          />
        </div>
      )}

      <section className="relative flex items-center justify-center min-h-[220px] md:min-h-[260px] bg-[#e3f0ff] dark:bg-gradient-to-b dark:from-[#182848] dark:to-[#35577d] py-8 md:py-10 overflow-hidden shadow-md border-b border-blue-200 dark:border-blue-900">
        <img
          src="/assets/images/gia-su-hoang-ha-header.jpg"
          alt="Trung tâm Gia Sư Hoàng Hà"
          className="absolute inset-0 m-auto w-full h-full object-cover opacity-80 pointer-events-none select-none z-0"
        />
      </section>

      <AboutIntroSection centerInfo={centerInfo} />
      <AboutHistorySection />
      <AboutVisionSection />
      <AboutMissionSection />
      <AboutServicesSection />
      <AboutTeamSection tutors={tutors} />
      <AboutGallerySection
        previewImg={previewImg}
        onPreview={setPreviewImg}
        onClosePreview={() => setPreviewImg(null)}
      />
      <AboutLetterSection />
      <Chatbot />
    </Layout>
  );
};

export default AboutPage;
