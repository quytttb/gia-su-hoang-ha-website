import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { BlogService, ListPostsOptions } from '@/services/blogService';
import { blogCategories } from '@/constants/blogData';
import { BlogPost } from '@/types';
import { queryKeys } from '@/lib/queryKeys';

export type ResolvedBlogPost = BlogPost & {
  slug?: string;
  coverImage?: { url: string; publicId?: string };
  contentHtml?: string;
  contentMarkdown?: string;
  authorName?: string;
  categoryId?: string;
};

export const useBlogPosts = (options?: ListPostsOptions) =>
  useQuery({
    queryKey: queryKeys.blogPosts.list(options),
    queryFn: () => BlogService.listPosts(options ?? { pageSize: 12 }),
  });

export const useInfiniteBlogPosts = (options?: Omit<ListPostsOptions, 'cursor'>) =>
  useInfiniteQuery({
    queryKey: queryKeys.blogPosts.infinite(options),
    queryFn: ({ pageParam }) =>
      BlogService.listPosts({
        pageSize: options?.pageSize ?? 12,
        ...options,
        cursor: pageParam ?? undefined,
      }),
    initialPageParam: null as unknown,
    getNextPageParam: lastPage => lastPage.cursor ?? undefined,
  });

type AdminBlogFilter = {
  categoryId?: string;
  status?: string;
  search?: string;
};

export const useAdminBlogPosts = (filter: AdminBlogFilter) =>
  useInfiniteQuery({
    queryKey: queryKeys.blogPosts.admin(filter),
    queryFn: ({ pageParam }) =>
      BlogService.listPosts({
        pageSize: 10,
        categoryId: filter.categoryId,
        status: (filter.status as ListPostsOptions['status']) || undefined,
        cursor: pageParam ?? undefined,
      }),
    initialPageParam: null as unknown,
    getNextPageParam: lastPage => lastPage.cursor ?? undefined,
  });

async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const normalizedSlug = decodeURIComponent(slug).trim();
  let post: BlogPost | null = null;

  try {
    post = await BlogService.getPostBySlug(normalizedSlug);
  } catch {
    post = null;
  }

  if (!post) {
    try {
      post = await BlogService.getPostById(normalizedSlug, false);
    } catch {
      post = null;
    }
  }

  if (!post) {
    try {
      post = await BlogService.getPostById(normalizedSlug, true);
    } catch {
      post = null;
    }
  }

  return post;
}

export const useBlogPost = (slug: string) =>
  useQuery({
    queryKey: queryKeys.blogPosts.detail(slug),
    queryFn: async (): Promise<ResolvedBlogPost | null> => {
      const post = await fetchBlogPostBySlug(slug);
      if (!post) return null;

      const postAny = post as ResolvedBlogPost;
      const catId = postAny.categoryId || postAny.category?.id;
      const category = postAny.category || blogCategories.find(c => c.id === catId);
      return { ...postAny, category: category ?? postAny.category };
    },
    enabled: !!slug,
  });

export const useRelatedBlogPosts = (postId: string, categoryId?: string, tags?: string[]) =>
  useQuery({
    queryKey: queryKeys.blogPosts.related(postId),
    queryFn: async () => {
      const latestRes = await BlogService.listPosts({ pageSize: 8 });
      const others = latestRes.posts.filter(x => x.id !== postId);
      const latestPosts = others.slice(0, 4);
      const related = others
        .filter(r => {
          const rAny = r as BlogPost & { categoryId?: string };
          const rCat = rAny.categoryId || rAny.category?.id;
          return (
            (rCat && categoryId && rCat === categoryId) ||
            (rAny.tags && tags && rAny.tags.some(t => tags.includes(t)))
          );
        })
        .slice(0, 3);
      return { latestPosts, relatedPosts: related };
    },
    enabled: !!postId,
  });
