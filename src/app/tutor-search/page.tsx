import type { Metadata } from 'next';
import TutorSearchPage from '@/pages/TutorSearchPage';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Tìm Gia sư - Trung tâm Gia Sư Hoàng Hà',
  description:
    'Chọn gia sư giáo viên hoặc sinh viên phù hợp với nhu cầu học tập của gia đình tại Trung tâm Gia Sư Hoàng Hà.',
  keywords: 'tìm gia sư, gia sư giáo viên, gia sư sinh viên, gia sư thanh hóa',
  canonical: 'https://giasuhoangha.com/tutor-search',
  ogImage: 'https://giasuhoangha.com/og-image.jpg',
});

const TutorSearchRoute = () => <TutorSearchPage />;

export default TutorSearchRoute;
