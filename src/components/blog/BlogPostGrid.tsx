import { Search } from 'lucide-react';
import BlogCard from './BlogCard';
import SkeletonLoading from '../shared/SkeletonLoading';
import { Button } from '@/components/ui/button';
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
      <Card className="mb-6 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20">
        <CardContent className="py-6">
          <h3 className="text-red-600 dark:text-red-400 font-semibold mb-2">Lỗi tải dữ liệu</h3>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4">{error}</p>
          <Button variant="outline" size="sm" onClick={onRetry}>
            Thử lại
          </Button>
        </CardContent>
      </Card>
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
