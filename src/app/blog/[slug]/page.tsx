import type { Metadata } from 'next';
import BlogDetailPage from '@/pages/BlogDetailPage';
import { hasFirebasePublicConfig } from '@/lib/env';
import { BlogService } from '@/services/blogService';
import { buildMetadata } from '@/lib/metadata';

interface BlogDetailRouteProps {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({ params }: BlogDetailRouteProps): Promise<Metadata> => {
  const { slug } = await params;

  if (!hasFirebasePublicConfig) {
    return buildMetadata({
      title: 'Bài viết giáo dục - Trung tâm Gia Sư Hoàng Hà',
      description: 'Nội dung blog giáo dục và kinh nghiệm học tập từ Trung tâm Gia Sư Hoàng Hà.',
      canonical: `https://giasuhoangha.com/blog/${slug}`,
    });
  }

  try {
    const post = await BlogService.getPostBySlug(slug);
    if (post) {
      const socialImage =
        (post as { coverImage?: { url?: string } }).coverImage?.url ||
        post.imageUrl ||
        '/og-image.jpg';

      return buildMetadata({
        title: post.seo?.metaTitle || `${post.title} - Blog Giáo Dục`,
        description: post.seo?.metaDescription || post.excerpt,
        keywords: post.seo?.keywords?.join(', ') || post.tags?.join(', '),
        canonical: `https://giasuhoangha.com/blog/${slug}`,
        ogImage: socialImage,
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
