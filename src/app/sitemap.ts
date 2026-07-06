import type { MetadataRoute } from 'next';
import { hasSupabaseConfig } from '@/lib/env';
import { getAllClasses } from '@/data/classes';
import { listPosts } from '@/data/blog';

const siteUrl = 'https://giasuhoangha.com';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/classes`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/tutor-search`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/schedule`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/contact`, changeFrequency: 'monthly', priority: 0.7 },
  ];

  if (!hasSupabaseConfig) {
    return staticRoutes;
  }

  try {
    const [classes, blogResult] = await Promise.all([
      getAllClasses(),
      listPosts({ pageSize: 200, status: 'published' }),
    ]);

    const classRoutes = classes
      .filter(classData => classData.id)
      .flatMap(classData => [
        {
          url: `${siteUrl}/classes/${classData.id}`,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        },
        {
          url: `${siteUrl}/classes/${classData.id}/register`,
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        },
      ]);

    const blogRoutes = blogResult.posts.map(post => ({
      url: `${siteUrl}/blog/${post.slug || post.id}`,
      lastModified: new Date(post.updatedAt || post.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: post.featured ? 0.8 : 0.7,
    }));

    return [...staticRoutes, ...classRoutes, ...blogRoutes];
  } catch (error) {
    console.error('Failed to build dynamic sitemap entries:', error);
    return staticRoutes;
  }
};

export default sitemap;
