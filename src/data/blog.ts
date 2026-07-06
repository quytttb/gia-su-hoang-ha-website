'use server';

import { prisma } from '@/lib/prisma';
import type { BlogCategory, BlogPost } from '@/types';
import { blogCategories } from '@/constants/blogData';

type BlogPostRecord = Awaited<ReturnType<typeof prisma.blogPost.findMany>>[number];

export interface ListPostsOptions {
  pageSize?: number;
  categoryId?: string;
  tag?: string;
  status?: 'draft' | 'published' | 'archived';
  sort?: 'latest' | 'popular';
  cursor?: string;
}

const DEFAULT_CATEGORY: BlogCategory = {
  id: 'uncategorized',
  name: 'Khác',
  slug: 'khac',
};

function resolveCategory(categoryId: string | null | undefined): BlogCategory {
  if (!categoryId) return DEFAULT_CATEGORY;
  return blogCategories.find(c => c.id === categoryId) ?? DEFAULT_CATEGORY;
}

function parseSeo(value: unknown): BlogPost['seo'] {
  if (!value || typeof value !== 'object') return undefined;
  const seo = value as Record<string, unknown>;
  return {
    metaTitle: typeof seo.metaTitle === 'string' ? seo.metaTitle : undefined,
    metaDescription: typeof seo.metaDescription === 'string' ? seo.metaDescription : undefined,
    keywords: Array.isArray(seo.keywords)
      ? seo.keywords.filter((k): k is string => typeof k === 'string')
      : undefined,
  };
}

function toBlogPost(record: BlogPostRecord): BlogPost & { contentMarkdown?: string } {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    subtitle: record.subtitle ?? undefined,
    content: record.contentHtml,
    contentMarkdown: record.contentMarkdown,
    excerpt: record.excerpt,
    author: record.authorName,
    publishedAt: record.publishedAt?.toISOString() ?? record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    imageUrl: record.coverImageUrl ?? '',
    category: resolveCategory(record.categoryId),
    tags: record.tags,
    status: record.status,
    featured: record.featured,
    readTime: record.readTime,
    viewCount: record.viewCount,
    seo: parseSeo(record.seo),
  };
}

export async function listPosts(
  options: ListPostsOptions = {}
): Promise<{ posts: BlogPost[]; cursor: string | null }> {
  try {
    const pageSize = options.pageSize ?? 10;
    const status = options.status ?? 'published';

    const records = await prisma.blogPost.findMany({
      where: {
        status,
        ...(options.categoryId ? { categoryId: options.categoryId } : {}),
        ...(options.tag ? { tags: { has: options.tag } } : {}),
      },
      orderBy:
        options.sort === 'popular'
          ? [{ viewCount: 'desc' }, { publishedAt: 'desc' }]
          : [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: pageSize + 1,
      ...(options.cursor
        ? {
            cursor: { id: options.cursor },
            skip: 1,
          }
        : {}),
    });

    const hasMore = records.length > pageSize;
    const page = hasMore ? records.slice(0, pageSize) : records;
    const cursor = hasMore ? (page[page.length - 1]?.id ?? null) : null;

    return {
      posts: page.map(toBlogPost),
      cursor,
    };
  } catch (error) {
    console.error('Error listing blog posts:', error);
    return { posts: [], cursor: null };
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const record = await prisma.blogPost.findUnique({ where: { slug } });
    if (!record || record.status !== 'published') return null;
    return toBlogPost(record);
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  try {
    const record = await prisma.blogPost.findUnique({ where: { id } });
    if (!record) return null;
    return toBlogPost(record);
  } catch (error) {
    console.error('Error fetching blog post by id:', error);
    return null;
  }
}

export async function getRelatedPosts(
  postId: string,
  categoryId?: string,
  tags?: string[]
): Promise<{ relatedPosts: BlogPost[]; latestPosts: BlogPost[] }> {
  try {
    const latest = await prisma.blogPost.findMany({
      where: { status: 'published', id: { not: postId } },
      orderBy: [{ publishedAt: 'desc' }],
      take: 6,
    });

    const relatedWhere = {
      status: 'published' as const,
      id: { not: postId },
      ...(categoryId ? { categoryId } : tags?.length ? { tags: { hasSome: tags } } : {}),
    };

    const related = await prisma.blogPost.findMany({
      where: relatedWhere,
      orderBy: [{ publishedAt: 'desc' }],
      take: 4,
    });

    return {
      relatedPosts: related.map(toBlogPost),
      latestPosts: latest.map(toBlogPost),
    };
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return { relatedPosts: [], latestPosts: [] };
  }
}
