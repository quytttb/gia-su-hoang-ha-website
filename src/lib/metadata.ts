import type { Metadata } from 'next';
import type { SEOData } from '@/utils/seo';

const siteName = 'Trung tâm Gia Sư Hoàng Hà';

export const buildMetadata = (seo: SEOData): Metadata => {
  const title = seo.title;
  const description = seo.description;
  const canonical = seo.canonical;
  const image = seo.ogImage ? [seo.ogImage] : undefined;

  return {
    title: {
      absolute: title,
    },
    description,
    keywords: seo.keywords
      ?.split(',')
      .map(keyword => keyword.trim())
      .filter(Boolean),
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
      url: seo.ogUrl || canonical,
      siteName,
      type: 'website',
      images: image,
      locale: 'vi_VN',
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
      images: image,
    },
  };
};
