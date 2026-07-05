import React, { useEffect, useState, useCallback } from 'react';
import BlogPostTable from '../../components/panel/blog/BlogPostTable';
import BlogPostForm from '../../components/panel/blog/BlogPostForm';
import { BlogService } from '../../services/blogService';
import { blogCategories } from '../../constants/blogData';
import { useToast } from '../../hooks/useToast';

const BlogPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [cursor, setCursor] = useState<any | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [filter, setFilter] = useState<{ categoryId?: string; status?: string; search?: string }>(
    {}
  );
  const { success, error } = useToast();

  const catList = blogCategories.map(c => ({ id: c.id, name: c.name })); // later dynamic

  const fetchPosts = useCallback(
    async (reset = false) => {
      try {
        if (reset) {
          setLoading(true);
        }
        const res = await BlogService.listPosts({
          pageSize: 10,
          categoryId: filter.categoryId,
          status: (filter.status as any) || undefined,
          // Basic search client-side (firestore text search limited) — fetch published then filter below if search exists
          cursor: reset ? null : cursor,
        });
        let newPosts = reset ? res.posts : [...posts, ...res.posts];
        if (filter.search) {
          const s = filter.search.toLowerCase();
          newPosts = newPosts.filter(
            p =>
              p.title.toLowerCase().includes(s) || (p.tags || []).some((t: string) => t.includes(s))
          );
        }
        setPosts(newPosts);
        setCursor(res.cursor);
        setHasMore(!!res.cursor);
      } catch (e: any) {
        error('Lỗi tải bài viết', e.message);
      } finally {
        setLoading(false);
      }
    },
    [filter.categoryId, filter.status, filter.search, cursor, posts, error]
  );

  useEffect(() => {
    fetchPosts(true);
  }, [fetchPosts, filter.categoryId, filter.status, filter.search]);

  // Global refresh listener
  useEffect(() => {
    const handler = () => fetchPosts(true);
    window.addEventListener('panel-global-refresh', handler as EventListener);
    return () => window.removeEventListener('panel-global-refresh', handler as EventListener);
  }, [fetchPosts]);

  const handleCreate = () => {
    setEditingPost(null);
    setFormOpen(true);
  };
  const handleEdit = (post: any) => {
    setEditingPost(post);
    setFormOpen(true);
  };

  const handleDelete = async (post: any) => {
    if (!window.confirm('Xóa (lưu trữ) bài viết này?')) return;
    try {
      await BlogService.deletePost(post.id);
      success('Đã lưu trữ', 'Bài viết đã chuyển vào lưu trữ.');
      fetchPosts(true);
    } catch (e: any) {
      error('Lỗi', e.message);
    }
  };

  const handleSaved = () => {
    fetchPosts(true);
  };

  return (
    <>
      {loading && posts.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">Đang tải...</div>
      ) : (
        <BlogPostTable
          posts={posts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
          onLoadMore={() => fetchPosts(false)}
          hasMore={hasMore}
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
