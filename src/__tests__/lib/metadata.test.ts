import { describe, expect, it } from 'vitest';
import { buildMetadata } from '@/lib/metadata';

describe('buildMetadata', () => {
  it('maps SEO data to Next.js metadata', () => {
    const metadata = buildMetadata({
      title: 'Trang chủ - Gia Sư Hoàng Hà',
      description: 'Mô tả trang chủ',
      keywords: 'gia sư, thanh hóa',
      canonical: 'https://giasuhoangha.com/',
      ogImage: 'https://giasuhoangha.com/og-image.jpg',
    });

    expect(metadata.title).toEqual({ absolute: 'Trang chủ - Gia Sư Hoàng Hà' });
    expect(metadata.description).toBe('Mô tả trang chủ');
    expect(metadata.keywords).toEqual(['gia sư', 'thanh hóa']);
    expect(metadata.alternates?.canonical).toBe('https://giasuhoangha.com/');
    expect(metadata.openGraph?.images).toEqual(['https://giasuhoangha.com/og-image.jpg']);
    expect(metadata.twitter?.card).toBe('summary_large_image');
  });
});
