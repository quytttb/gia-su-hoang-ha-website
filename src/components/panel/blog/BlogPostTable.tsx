import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../ui/select';
import { Badge } from '../../ui/badge';
import { format } from 'date-fns';
import { Edit, Trash2, Star } from 'lucide-react';

interface BlogPostTableProps {
  posts: any[]; // BlogPost
  onEdit: (post: any) => void;
  onDelete: (post: any) => void;
  onCreate: () => void;
  onLoadMore: () => void;
  hasMore: boolean;
  categories: { id: string; name: string }[];
  onFilter: (f: { categoryId?: string; status?: string; search?: string }) => void;
}

export const BlogPostTable: React.FC<BlogPostTableProps> = ({
  posts,
  onEdit,
  onDelete,
  onCreate,
  onLoadMore,
  hasMore,
  categories,
  onFilter,
}) => {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [status, setStatus] = useState('all');

  const applyFilter = () => {
    onFilter({
      search: search || undefined,
      categoryId: categoryId === 'all' ? undefined : categoryId,
      status: status === 'all' ? undefined : status,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilter();
  };

  return (
    <div className="space-y-4 text-black dark:text-white">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Bài viết Blog</h2>
        <Button onClick={onCreate}>+ Bài viết mới</Button>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-end">
        <Input
          placeholder="Tìm tiêu đề hoặc tag..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-56"
        />
        <Select
          value={categoryId}
          onValueChange={v => {
            setCategoryId(v);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Chủ đề" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả chủ đề</SelectItem>
            {categories.map(c => (
              <SelectItem value={c.id} key={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={status}
          onValueChange={v => {
            setStatus(v);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="draft">Nháp</SelectItem>
            <SelectItem value="published">Xuất bản</SelectItem>
            <SelectItem value="archived">Lưu trữ</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" variant="outline">
          Lọc
        </Button>
      </form>
      <div className="overflow-x-auto border rounded-lg bg-background">
        <table className="min-w-full text-sm table-auto text-black dark:text-white">
          <thead>
            <tr className="bg-muted/70 text-xs uppercase tracking-wide text-black dark:text-white">
              <th className="p-2 text-left font-semibold w-24">Ảnh</th>
              <th className="p-2 text-left font-semibold">Bài viết</th>
              <th className="p-2 text-center font-semibold w-24">Chủ đề</th>
              <th className="p-2 text-center font-semibold w-28">Trạng thái</th>
              <th className="p-2 text-center font-semibold w-28">Nổi bật</th>
              <th className="p-2 text-center font-semibold w-20">Views</th>
              <th className="p-2 text-center font-semibold w-24">Ngày</th>
              <th className="p-2 text-center font-semibold w-28">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center p-6 text-muted-foreground">
                  Chưa có bài viết
                </td>
              </tr>
            )}
            {posts.map(p => (
              <tr
                key={p.id}
                className="border-b last:border-0 hover:bg-accent/30 transition-colors group"
              >
                <td className="p-2 align-top">
                  {p.coverImage?.url ? (
                    <img
                      src={p.coverImage.url}
                      className="h-12 w-16 object-cover rounded-md border shadow-sm group-hover:shadow"
                      onError={e => {
                        e.currentTarget.src = '/placeholder-image.jpg';
                      }}
                    />
                  ) : (
                    <div className="h-12 w-16 bg-muted rounded-md border" />
                  )}
                </td>
                <td className="p-2 align-top max-w-lg">
                  <div className="space-y-1">
                    <p
                      className="font-semibold leading-snug text-black dark:text-white line-clamp-2"
                      title={p.title}
                    >
                      {p.title}
                    </p>
                    <p
                      className="text-xs text-black/60 dark:text-white/60 line-clamp-1"
                      title={p.slug}
                    >
                      {p.slug}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {(p.tags || []).slice(0, 3).map((t: string) => (
                        <Badge key={t} variant="secondary" className="text-[10px]">
                          {t}
                        </Badge>
                      ))}
                      {p.tags && p.tags.length > 3 && (
                        <Badge variant="outline" className="text-[10px]">
                          +{p.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-2 align-top text-center text-xs font-medium">
                  {p.categoryId || '-'}
                </td>
                <td className="p-2 align-top text-center min-w-[7rem]">
                  {p.status === 'published' ? (
                    <span className="inline-block px-2 py-0.5 text-[11px] rounded-full bg-green-600 text-white dark:bg-green-500 dark:text-black">
                      Xuất bản
                    </span>
                  ) : p.status === 'draft' ? (
                    <span className="inline-block px-2 py-0.5 text-[11px] rounded-full bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      Nháp
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-0.5 text-[11px] rounded-full bg-red-500 text-white dark:bg-red-600">
                      Lưu trữ
                    </span>
                  )}
                </td>
                <td className="p-2 align-top text-center">
                  {p.featured ? (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-full bg-yellow-400 text-black dark:bg-yellow-600 dark:text-black"
                      title="Bài viết nổi bật"
                    >
                      <Star className="h-3 w-3" /> Có
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </td>
                <td className="p-2 align-top text-center font-medium">{p.viewCount || 0}</td>
                <td className="p-2 align-top text-center text-[11px]">
                  {p.publishedAt?.seconds
                    ? format(new Date(p.publishedAt.seconds * 1000), 'dd/MM/yyyy')
                    : '-'}
                </td>
                <td className="p-2 align-top text-center">
                  <div className="flex items-start justify-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0 flex items-center justify-center"
                      onClick={() => onEdit(p)}
                      title="Sửa"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-7 w-7 p-0 flex items-center justify-center"
                      onClick={() => onDelete(p)}
                      title="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMore && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={onLoadMore}>
            Tải thêm
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogPostTable;
