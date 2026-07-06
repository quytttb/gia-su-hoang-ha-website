import type { Metadata } from 'next';
import BlogScreen from '@/components/screens/BlogScreen';
import { buildMetadata } from '@/lib/metadata';
import { listPosts } from '@/data/blog';

export const metadata: Metadata = buildMetadata({
  title: 'Blog Giáo Dục - Trung tâm Gia Sư Hoàng Hà',
  description:
    'Tin tức giáo dục, kinh nghiệm học tập và các bài viết chuyên sâu từ Trung tâm Gia Sư Hoàng Hà.',
  keywords: 'blog giáo dục, kinh nghiệm học tập, gia sư thanh hóa, luyện thi, phương pháp học',
  canonical: 'https://giasuhoangha.com/blog',
  ogImage: 'https://giasuhoangha.com/og-image.jpg',
});

const BlogRoute = async () => {
  const { posts, cursor } = await listPosts({ pageSize: 12 });

  return <BlogScreen initialPosts={posts} initialCursor={cursor} />;
};

export default BlogRoute;
