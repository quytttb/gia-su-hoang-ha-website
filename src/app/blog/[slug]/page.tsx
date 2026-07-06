import type { Metadata } from 'next';
import BlogDetailPage from '@/pages/BlogDetailPage';
import { hasSupabaseConfig } from '@/lib/env';
import { getPostBySlug } from '@/data/blog';
import { buildMetadata } from '@/lib/metadata';

interface BlogDetailRouteProps {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({ params }: BlogDetailRouteProps): Promise<Metadata> => {
  const { slug } = await params;

  if (!hasSupabaseConfig) {
    return buildMetadata({
      title: 'Bài viết giáo dục - Trung tâm Gia Sư Hoàng Hà',
      description: 'Nội dung blog giáo dục và kinh nghiệm học tập từ Trung tâm Gia Sư Hoàng Hà.',
      canonical: `https://giasuhoangha.com/blog/${slug}`,
    });
  }

  try {
    const post = await getPostBySlug(slug);
    if (post) {
      return buildMetadata({
        title: post.seo?.metaTitle || `${post.title} - Blog Giáo Dục`,
        description: post.seo?.metaDescription || post.excerpt,
        keywords: post.seo?.keywords?.join(', ') || post.tags?.join(', '),
        canonical: `https://giasuhoangha.com/blog/${slug}`,
        ogImage: post.imageUrl || '/og-image.jpg',
      });
    }
  } catch (error) {
    console.error('Failed to generate blog metadata:', error);
  }

  return buildMetadata({
    title: 'Bài viết giáo dục - Trung tâm Gia Sư Hoàng Hà',
    description: 'Nội dung blog giáo dục và kinh nghiệm học tập từ Trung tâm Gia Sư Hoàng Hà.',
    canonical: `https://giasuhoangha.com/blog/${slug}`,
  });
};

const BlogDetailRoute = () => <BlogDetailPage />;

export default BlogDetailRoute;
