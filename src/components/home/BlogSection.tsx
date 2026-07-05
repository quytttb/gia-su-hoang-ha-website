import Link from 'next/link';
import BlogCard from '../blog/BlogCard';
import { Button } from '../ui/button';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BlogService } from '../../services/blogService';

const BlogSection = () => {
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await BlogService.listPosts({ pageSize: 6, sort: 'latest' });
        if (!active) return;
        const featured = res.posts.filter(p => p.featured).slice(0, 2);
        setFeaturedPosts(featured);
      } catch (e: any) {
        if (active) setError(e.message || 'Không thể tải bài viết');
      } finally {
        active && setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="blog"
      className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900/20"
      aria-labelledby="blog-heading"
    >
      <div className="container-custom">
        {/* Section Header */}
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

        {/* Featured Posts */}
        {loading ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">Đang tải...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 dark:text-red-400 text-sm">{error}</div>
        ) : featuredPosts.length > 0 ? (
          <>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Bài viết nổi bật
                </h3>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-primary to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-12">
              {featuredPosts.map(post => (
                <article key={post.id}>
                  <BlogCard post={post} variant="featured" />
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Chưa có bài viết nào để hiển thị
            </p>
          </div>
        )}

        {/* Call to Action */}
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
