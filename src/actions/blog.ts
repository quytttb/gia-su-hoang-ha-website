'use server';

import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import slugifyLib from 'slugify';
import type { BlogPost, BlogPostStatus, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { ActionResult } from './types';

const slugify = (title: string): string =>
  slugifyLib(title, { lower: true, strict: true, locale: 'vi' });

const computeReadTime = (markdown: string): number => {
  const words = markdown
    .replace(/[#*_`>-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  return Math.max(1, Math.ceil(words.length / 200));
};

const extractExcerpt = (markdown: string, length = 160): string => {
  const text = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/[#>*_-]/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.slice(0, length).trim();
};

const markdownToHtml = (md: string): string => {
  const parsed = marked.parse(md);
  const raw = typeof parsed === 'string' ? parsed : '';
  try {
    return DOMPurify.sanitize(raw);
  } catch {
    return raw;
  }
};

const normalizeTags = (tags: string[]): string[] =>
  Array.from(new Set(tags.map(t => t.trim().toLowerCase()).filter(Boolean))).slice(0, 10);

async function ensureUniqueSlug(base: string): Promise<string> {
  let candidate = base;
  let idx = 1;

  while (true) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: candidate } });
    if (!existing) return candidate;
    idx += 1;
    candidate = `${base}-${idx}`;
  }
}

export type CreatePostInput = {
  title: string;
  subtitle?: string;
  contentMarkdown: string;
  excerpt?: string;
  authorName: string;
  categoryId?: string;
  tags?: string[];
  status?: BlogPostStatus;
  featured?: boolean;
  coverImageUrl?: string;
  coverPublicId?: string;
  seo?: Prisma.InputJsonValue;
};

export type UpdatePostInput = Partial<CreatePostInput>;

export async function createPost(input: CreatePostInput): Promise<ActionResult<BlogPost>> {
  try {
    const slug = await ensureUniqueSlug(slugify(input.title));
    const tags = normalizeTags(input.tags ?? []);
    const readTime = computeReadTime(input.contentMarkdown);
    const contentHtml = markdownToHtml(input.contentMarkdown);
    const excerpt = input.excerpt?.trim() || extractExcerpt(input.contentMarkdown);
    const status = input.status ?? 'draft';

    const post = await prisma.blogPost.create({
      data: {
        id: randomUUID(),
        slug,
        title: input.title,
        subtitle: input.subtitle,
        contentMarkdown: input.contentMarkdown,
        contentHtml,
        excerpt,
        authorName: input.authorName,
        categoryId: input.categoryId,
        tags,
        status,
        featured: input.featured ?? false,
        readTime,
        coverImageUrl: input.coverImageUrl,
        coverPublicId: input.coverPublicId,
        seo: input.seo,
        publishedAt: status === 'published' ? new Date() : null,
      },
    });

    revalidatePath('/blog');
    revalidatePath('/panel/blog-posts');
    if (status === 'published') {
      revalidatePath(`/blog/${slug}`);
    }
    return { success: true, data: post };
  } catch (error) {
    console.error('createPost:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo bài viết',
    };
  }
}

export async function updatePost(
  id: string,
  input: UpdatePostInput
): Promise<ActionResult<BlogPost>> {
  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy bài viết' };
    }

    const data: Prisma.BlogPostUpdateInput = {};

    if (input.title !== undefined) data.title = input.title;
    if (input.subtitle !== undefined) data.subtitle = input.subtitle;
    if (input.authorName !== undefined) data.authorName = input.authorName;
    if (input.categoryId !== undefined) data.categoryId = input.categoryId;
    if (input.tags !== undefined) data.tags = normalizeTags(input.tags);
    if (input.featured !== undefined) data.featured = input.featured;
    if (input.coverImageUrl !== undefined) data.coverImageUrl = input.coverImageUrl;
    if (input.coverPublicId !== undefined) data.coverPublicId = input.coverPublicId;
    if (input.seo !== undefined) data.seo = input.seo;

    if (input.contentMarkdown !== undefined) {
      data.contentMarkdown = input.contentMarkdown;
      data.contentHtml = markdownToHtml(input.contentMarkdown);
      data.readTime = computeReadTime(input.contentMarkdown);
      data.excerpt = input.excerpt?.trim() || extractExcerpt(input.contentMarkdown);
    } else if (input.excerpt !== undefined) {
      data.excerpt = input.excerpt.trim();
    }

    if (input.status !== undefined) {
      data.status = input.status;
      if (input.status === 'published' && !existing.publishedAt) {
        data.publishedAt = new Date();
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data,
    });

    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath('/panel/blog-posts');
    return { success: true, data: post };
  } catch (error) {
    console.error('updatePost:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật bài viết',
    };
  }
}

export async function deletePost(id: string): Promise<ActionResult> {
  try {
    const post = await prisma.blogPost.delete({ where: { id } });

    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath('/panel/blog-posts');
    return { success: true };
  } catch (error) {
    console.error('deletePost:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa bài viết',
    };
  }
}

export async function incrementViewCount(id: string): Promise<ActionResult<BlogPost>> {
  try {
    const post = await prisma.blogPost.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    revalidatePath(`/blog/${post.slug}`);
    return { success: true, data: post };
  } catch (error) {
    console.error('incrementViewCount:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật lượt xem',
    };
  }
}
