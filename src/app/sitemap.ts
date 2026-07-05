import type { MetadataRoute } from 'next';
import { hasFirebasePublicConfig } from '@/lib/env';
import { BlogService } from '@/services/blogService';
import classesService from '@/services/firestore/classesService';
import { convertFirestoreClass } from '@/utils/classHelpers';

const siteUrl = 'https://giasuhoangha.com';

const toDate = (value: unknown) => {
  if (!value) return new Date();
  if (
    typeof value === 'object' &&
    value &&
    'toDate' in value &&
    typeof value.toDate === 'function'
  ) {
    return value.toDate();
  }
  if (
    typeof value === 'object' &&
    value &&
    'seconds' in value &&
    typeof value.seconds === 'number'
  ) {
    return new Date(value.seconds * 1000);
  }
  if (typeof value === 'string' || value instanceof Date) {
    return new Date(value);
  }
  return new Date();
};

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

  if (!hasFirebasePublicConfig) {
    return staticRoutes;
  }

  try {
    const [classResult, blogResult] = await Promise.all([
      classesService.getAll({ limit: 200 }),
      BlogService.listPosts({ pageSize: 200, status: 'published' }),
    ]);

    const classRoutes = classResult.data
      .map(convertFirestoreClass)
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

    const blogRoutes = blogResult.posts.map(post => {
      const slug = (post as { slug?: string }).slug || post.id;

      return {
        url: `${siteUrl}/blog/${slug}`,
        lastModified: toDate(
          (post as { createdAt?: unknown }).createdAt || post.updatedAt || post.publishedAt
        ),
        changeFrequency: 'monthly' as const,
        priority: post.featured ? 0.8 : 0.7,
      };
    });

    return [...staticRoutes, ...classRoutes, ...blogRoutes];
  } catch (error) {
    console.error('Failed to build dynamic sitemap entries:', error);
    return staticRoutes;
  }
};

export default sitemap;
