import type { MetadataRoute } from 'next';

const robots = (): MetadataRoute.Robots => ({
  rules: [
    {
      userAgent: '*',
      allow: '/',
      disallow: ['/panel', '/login'],
    },
  ],
  sitemap: 'https://giasuhoangha.com/sitemap.xml',
  host: 'https://giasuhoangha.com',
});

export default robots;
