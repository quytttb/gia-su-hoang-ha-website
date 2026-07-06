import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import { listPosts, getPostBySlug, getRelatedPosts, type ListPostsOptions } from '@/data/blog';
import { incrementViewCount } from '@/actions/blog';
import { queryKeys } from '@/lib/queryKeys';
import type { BlogPost } from '@/types';

export type { ListPostsOptions };

type BlogPostsPage = { posts: BlogPost[]; cursor: string | null };

export const useBlogPosts = (options?: ListPostsOptions) =>
  useQuery({
    queryKey: queryKeys.blogPosts.list(options),
    queryFn: async () => {
      const result = await listPosts(options);
      return result.posts;
    },
  });

export const useAdminBlogPosts = (options?: ListPostsOptions) =>
  useQuery({
    queryKey: queryKeys.blogPosts.admin({ ...(options ?? {}) }),
    queryFn: async () => {
      const result = await listPosts({ ...options, status: options?.status ?? undefined });
      return result.posts;
    },
  });

export const useBlogPost = (slug: string) =>
  useQuery({
    queryKey: queryKeys.blogPosts.detail(slug),
    queryFn: () => getPostBySlug(slug),
    enabled: !!slug,
  });

export const useRelatedBlogPosts = (postId: string, categoryId?: string, tags?: string[]) =>
  useQuery({
    queryKey: queryKeys.blogPosts.related(postId),
    queryFn: () => getRelatedPosts(postId, categoryId, tags),
    enabled: !!postId,
  });

export const useInfiniteBlogPosts = (
  options?: Omit<ListPostsOptions, 'cursor'>,
  queryOptions?: Pick<
    UseInfiniteQueryOptions<
      BlogPostsPage,
      Error,
      { pages: BlogPostsPage[]; pageParams: unknown[] }
    >,
    'initialData'
  >
) =>
  useInfiniteQuery({
    queryKey: queryKeys.blogPosts.infinite(options),
    queryFn: async ({ pageParam }) => {
      const result = await listPosts({
        ...options,
        cursor: pageParam as string | undefined,
      });
      return result;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.cursor ?? undefined,
    ...queryOptions,
  });

export const useIncrementBlogView = () =>
  useMutation({
    mutationFn: (postId: string) => incrementViewCount(postId),
  });
