'use client';

import { useCallback, useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { CenterInfo, Tutor } from '@/types';
import Chatbot from '@/components/shared/Chatbot';
import PageHero from '@/components/shared/PageHero';
import ErrorDisplay from '@/components/shared/ErrorDisplay';
import AboutIntroSection from '@/components/about/AboutIntroSection';
import AboutHistorySection from '@/components/about/AboutHistorySection';
import AboutVisionSection from '@/components/about/AboutVisionSection';
import AboutMissionSection from '@/components/about/AboutMissionSection';
import AboutServicesSection from '@/components/about/AboutServicesSection';
import AboutTeamSection from '@/components/about/AboutTeamSection';
import AboutGallerySection from '@/components/about/AboutGallerySection';
import AboutLetterSection from '@/components/about/AboutLetterSection';
import type { GalleryImage, SiteAsset } from '@/data/settings';

interface AboutScreenProps {
  centerInfo: CenterInfo | null;
  tutors: Tutor[];
  galleryImages: GalleryImage[];
  headerAsset: SiteAsset | null;
}

const AboutScreen = ({ centerInfo, tutors, galleryImages, headerAsset }: AboutScreenProps) => {
  const [previewImg, setPreviewImg] = useState<string | null>(null);

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
    if (hash) {
      scrollToSection(hash.replace('#', ''));
    }
  }, [scrollToSection]);

  if (!centerInfo) {
    return (
      <Layout>
        <ErrorDisplay
          message="Không thể tải thông tin trung tâm"
          details="Vui lòng thử lại sau hoặc liên hệ với chúng tôi qua số điện thoại: 0385.510.892"
          retryLabel="Thử lại"
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHero
        title="Về Chúng Tôi"
        variant="image"
        imageSrc={headerAsset?.url || '/assets/images/gia-su-hoang-ha-header.jpg'}
        imageAlt="Trung tâm Gia Sư Hoàng Hà"
      />

      <AboutIntroSection centerInfo={centerInfo} />
      <AboutHistorySection />
      <AboutVisionSection />
      <AboutMissionSection />
      <AboutServicesSection />
      <AboutTeamSection tutors={tutors} />
      <AboutGallerySection
        images={galleryImages}
        previewImg={previewImg}
        onPreview={setPreviewImg}
        onClosePreview={() => setPreviewImg(null)}
      />
      <AboutLetterSection />
      <Chatbot />
    </Layout>
  );
};

export default AboutScreen;
