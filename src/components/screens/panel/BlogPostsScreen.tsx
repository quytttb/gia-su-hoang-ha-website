import React, { useEffect, useState, useMemo } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import BlogPostTable from '@/components/panel/blog/BlogPostTable';
import BlogPostForm from '@/components/panel/blog/BlogPostForm';
import { listPosts } from '@/data/blog';
import { updatePost } from '@/actions/blog';
import { blogCategories } from '@/constants/blogData';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/queryKeys';

type AdminPost = {
  id: string;
  title: string;
  subtitle?: string;
  slug?: string;
  tags?: string[];
  status?: string;
  featured?: boolean;
  viewCount?: number;
  publishedAt?: string;
  categoryId?: string;
  coverImage?: { url: string };
  contentMarkdown?: string;
};

const mapPostForAdmin = (
  post: Awaited<ReturnType<typeof listPosts>>['posts'][number]
): AdminPost => ({
  id: post.id,
  title: post.title,
  subtitle: post.subtitle,
  slug: post.slug,
  tags: post.tags,
  status: post.status,
  featured: post.featured,
  viewCount: post.viewCount,
  publishedAt: post.publishedAt,
  categoryId: post.category?.id,
  coverImage: post.imageUrl ? { url: post.imageUrl } : undefined,
  contentMarkdown: (post as AdminPost).contentMarkdown,
});

const BlogPostsScreen: React.FC = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<AdminPost | null>(null);
  const [filter, setFilter] = useState<{ categoryId?: string; status?: string; search?: string }>(
    {}
  );
  const queryClient = useQueryClient();

  const catList = blogCategories.map(c => ({ id: c.id, name: c.name }));

  const { data, isLoading, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery({
    queryKey: queryKeys.blogPosts.admin(filter),
    queryFn: ({ pageParam }) =>
      listPosts({
        pageSize: 10,
        cursor: pageParam,
        categoryId: filter.categoryId,
        status: filter.status as 'draft' | 'published' | 'archived' | undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.cursor ?? undefined,
  });

  const posts = useMemo(() => {
    const allPosts = (data?.pages.flatMap(page => page.posts) ?? []).map(mapPostForAdmin);
    if (!filter.search) return allPosts;
    const s = filter.search.toLowerCase();
    return allPosts.filter(
      p => p.title.toLowerCase().includes(s) || (p.tags || []).some(t => t.includes(s))
    );
  }, [data, filter.search]);

  useEffect(() => {
    const handler = () => {
      void refetch();
    };
    window.addEventListener('panel-global-refresh', handler as EventListener);
    return () => window.removeEventListener('panel-global-refresh', handler as EventListener);
  }, [refetch]);

  const invalidatePosts = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.blogPosts.all });
    void refetch();
  };

  const handleCreate = () => {
    setEditingPost(null);
    setFormOpen(true);
  };

  const handleEdit = (post: AdminPost) => {
    setEditingPost(post);
    setFormOpen(true);
  };

  const handleDelete = async (post: AdminPost) => {
    try {
      const result = await updatePost(post.id, { status: 'archived' });
      if (!result.success) {
        toast.error('Lỗi', { description: result.error ?? 'Không thể lưu trữ bài viết' });
        return;
      }
      toast.success('Đã lưu trữ', { description: 'Bài viết đã chuyển vào lưu trữ.' });
      invalidatePosts();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Lỗi không xác định';
      toast.error('Lỗi', { description: message });
    }
  };

  const handleSaved = () => {
    invalidatePosts();
  };

  return (
    <>
      {isLoading && posts.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">Đang tải...</div>
      ) : (
        <BlogPostTable
          posts={posts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
          onLoadMore={() => fetchNextPage()}
          hasMore={!!hasNextPage}
          categories={catList}
          onFilter={setFilter}
        />
      )}
      <BlogPostForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
        post={editingPost}
        categories={catList}
      />
    </>
  );
};

export default BlogPostsScreen;
