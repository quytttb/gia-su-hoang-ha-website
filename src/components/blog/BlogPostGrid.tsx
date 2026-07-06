import { Search } from 'lucide-react';
import BlogCard from './BlogCard';
import SkeletonLoading from '../shared/SkeletonLoading';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BlogPostGridProps {
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  posts: any[];
  searchTerm: string;
  selectedCategory: string;
  sortBy: 'latest' | 'popular' | 'readTime';
  hasMore: boolean;
  onSearchChange: (value: string) => void;
  onSortChange: (value: 'latest' | 'popular' | 'readTime') => void;
  onLoadMore: () => void;
  onRetry: () => void;
}

const BlogPostGrid = ({
  loading,
  loadingMore,
  error,
  posts,
  searchTerm,
  selectedCategory,
  sortBy,
  hasMore,
  onSearchChange,
  onSortChange,
  onLoadMore,
  onRetry,
}: BlogPostGridProps) => (
  <div id="main-content" className="lg:col-span-3">
    <div id="search-filter" className="mb-8">
      {loading ? (
        <div className="flex flex-col sm:flex-row gap-4">
          <SkeletonLoading type="text" count={1} />
          <SkeletonLoading type="button" width="150px" />
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={sortBy}
            onValueChange={(v: 'latest' | 'popular' | 'readTime') => onSortChange(v)}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Mới nhất</SelectItem>
              <SelectItem value="popular">Phổ biến</SelectItem>
              <SelectItem value="readTime">Thời gian đọc</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>

    {error && !loading && (
      <Alert variant="destructive" className="mb-6">
        <AlertTitle>Lỗi tải dữ liệu</AlertTitle>
        <AlertDescription>
          <p className="mb-4">{error}</p>
          <Button variant="outline" size="sm" onClick={onRetry}>
            Thử lại
          </Button>
        </AlertDescription>
      </Alert>
    )}

    <div id="posts-grid">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonLoading type="card" count={6} />
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Không tìm thấy bài viết</h3>
            <p className="text-muted-foreground">
              Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn chủ đề khác.
            </p>
          </CardContent>
        </Card>
      )}
      {!loading && !searchTerm && selectedCategory === 'all' && posts.length > 0 && hasMore && (
        <div className="flex justify-center mt-10">
          <Button
            onClick={onLoadMore}
            disabled={loadingMore}
            variant="outline"
            className="min-w-[200px]"
          >
            {loadingMore ? 'Đang tải...' : 'Xem thêm'}
          </Button>
        </div>
      )}
    </div>
  </div>
);

export default BlogPostGrid;
