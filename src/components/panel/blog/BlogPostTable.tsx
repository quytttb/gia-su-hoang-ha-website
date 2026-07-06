import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../ui/select';
import { Badge } from '../../ui/badge';
import StatusBadge from '@/components/shared/StatusBadge';
import { blogPostStatusConfig } from '@/lib/ui/status-badges';
import { format } from 'date-fns';
import { Edit, Trash2, Star } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
    <div className="space-y-4 text-foreground">
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
      <div className="border rounded-lg bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/70 text-xs uppercase tracking-wide">
              <TableHead className="font-semibold w-24">Ảnh</TableHead>
              <TableHead className="font-semibold">Bài viết</TableHead>
              <TableHead className="font-semibold text-center w-24">Chủ đề</TableHead>
              <TableHead className="font-semibold text-center w-28">Trạng thái</TableHead>
              <TableHead className="font-semibold text-center w-28">Nổi bật</TableHead>
              <TableHead className="font-semibold text-center w-20">Views</TableHead>
              <TableHead className="font-semibold text-center w-24">Ngày</TableHead>
              <TableHead className="font-semibold text-center w-28">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center p-6 text-muted-foreground">
                  Chưa có bài viết
                </TableCell>
              </TableRow>
            )}
            {posts.map(p => (
              <TableRow key={p.id} className="hover:bg-accent/30 group">
                <TableCell className="align-top">
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
                </TableCell>
                <TableCell className="align-top max-w-lg">
                  <div className="space-y-1">
                    <p
                      className="font-semibold leading-snug text-foreground line-clamp-2"
                      title={p.title}
                    >
                      {p.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1" title={p.slug}>
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
                </TableCell>
                <TableCell className="align-top text-center text-xs font-medium">
                  {p.categoryId || '-'}
                </TableCell>
                <TableCell className="align-top text-center min-w-[7rem]">
                  {(['published', 'draft', 'archived'] as const).includes(p.status) ? (
                    <StatusBadge
                      label={
                        blogPostStatusConfig[p.status as 'draft' | 'published' | 'archived'].label
                      }
                      variant={
                        blogPostStatusConfig[p.status as 'draft' | 'published' | 'archived'].variant
                      }
                      className="text-[11px]"
                    />
                  ) : (
                    <Badge variant="secondary" className="text-[11px]">
                      {p.status}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="align-top text-center">
                  {p.featured ? (
                    <Badge variant="warning" className="text-[11px]" title="Bài viết nổi bật">
                      <Star className="h-3 w-3" /> Có
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="align-top text-center font-medium">
                  {p.viewCount || 0}
                </TableCell>
                <TableCell className="align-top text-center text-[11px]">
                  {p.publishedAt?.seconds
                    ? format(new Date(p.publishedAt.seconds * 1000), 'dd/MM/yyyy')
                    : '-'}
                </TableCell>
                <TableCell className="align-top text-center">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
