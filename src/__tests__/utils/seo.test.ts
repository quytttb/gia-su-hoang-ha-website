import { beforeEach, describe, expect, it } from 'vitest';
import { generateBlogSEO, generateClassSEO, updateSEO } from '@/utils/seo';

describe('seo utilities', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.title = '';
  });

  it('updates document title and meta tags', () => {
    updateSEO({
      title: 'Tiêu đề test',
      description: 'Mô tả test',
      keywords: 'gia sư, thanh hóa',
      canonical: 'https://giasuhoangha.com/test',
    });

    expect(document.title).toBe('Tiêu đề test');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      'Mô tả test'
    );
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://giasuhoangha.com/test'
    );
  });

  it('generates class SEO data', () => {
    const seo = generateClassSEO('Luyện thi Toán', 'Khóa luyện thi chuyên sâu', 'class-1');

    expect(seo.title).toContain('Luyện thi Toán');
    expect(seo.canonical).toBe('https://giasuhoangha.com/classes/class-1');
  });

  it('generates blog SEO data', () => {
    const seo = generateBlogSEO({
      title: 'Mẹo học tập',
      excerpt: 'Các mẹo hữu ích',
      slug: 'meo-hoc-tap',
    });

    expect(seo.canonical).toBe('https://giasuhoangha.com/blog/meo-hoc-tap');
    expect(seo.ogTitle).toBe('Mẹo học tập');
  });
});
