import React, { useEffect, useState, useMemo } from 'react';
import BlogPostTable from '../../components/panel/blog/BlogPostTable';
import BlogPostForm from '../../components/panel/blog/BlogPostForm';
import { BlogService } from '../../services/blogService';
import { blogCategories } from '../../constants/blogData';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useAdminBlogPosts } from '@/hooks/useBlogPosts';
import { queryKeys } from '@/lib/queryKeys';

const BlogPostsPage: React.FC = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [filter, setFilter] = useState<{ categoryId?: string; status?: string; search?: string }>(
    {}
  );
  const queryClient = useQueryClient();

  const catList = blogCategories.map(c => ({ id: c.id, name: c.name }));

  const { data, isLoading, fetchNextPage, hasNextPage, refetch } = useAdminBlogPosts(filter);

  const posts = useMemo(() => {
    const allPosts = data?.pages.flatMap(page => page.posts) ?? [];
    if (!filter.search) return allPosts;
    const s = filter.search.toLowerCase();
    return allPosts.filter(
      p => p.title.toLowerCase().includes(s) || (p.tags || []).some((t: string) => t.includes(s))
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

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setFormOpen(true);
  };

  const handleDelete = async (post: any) => {
    try {
      await BlogService.deletePost(post.id);
      toast.success('Đã lưu trữ', { description: 'Bài viết đã chuyển vào lưu trữ.' });
      invalidatePosts();
    } catch (e: any) {
      toast.error('Lỗi', { description: e.message });
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

export default BlogPostsPage;
