import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import BlogFeaturedSection from '../blog/BlogFeaturedSection';

const BlogSection = () => {
  const { data, isLoading, error } = useBlogPosts({ pageSize: 6, sort: 'latest' });
  const featuredPosts = (data ?? []).filter(p => p.featured).slice(0, 2);

  return (
    <section
      id="blog"
      className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900/20"
      aria-labelledby="blog-heading"
    >
      <div className="container-custom">
        <header className="text-center mb-12">
          <h2
            id="blog-heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Tin tức & Blog
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Cập nhật những tin tức mới nhất và kiến thức hữu ích về giáo dục
          </p>
        </header>

        {error ? (
          <div className="text-center py-12 text-red-500 dark:text-red-400 text-sm">
            {error.message}
          </div>
        ) : (
          <BlogFeaturedSection loading={isLoading} featuredPosts={featuredPosts} />
        )}

        {!isLoading && !error && featuredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Chưa có bài viết nào để hiển thị
            </p>
          </div>
        )}

        <footer className="text-center">
          <Button
            size="lg"
            asChild
            className="rounded-full px-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Link href="/blog">
              Xem tất cả bài viết
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </footer>
      </div>
    </section>
  );
};

export default BlogSection;
