'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Layout from '../components/layout/Layout';
import PageHero from '../components/shared/PageHero';
import BlogFilterBar from '../components/blog/BlogFilterBar';
import BlogFeaturedSection from '../components/blog/BlogFeaturedSection';
import BlogPostGrid from '../components/blog/BlogPostGrid';
import BlogCard from '../components/blog/BlogCard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, TrendingUp, BookOpen, Filter } from 'lucide-react';
import { blogCategories } from '../constants/blogData';
import SkeletonLoading from '../components/shared/SkeletonLoading';
import { BlogService } from '../services/blogService';

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'readTime'>('latest');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);
  const [cursor, setCursor] = useState<any | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollToSection = useCallback((sectionId: string) => {
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && !loading) {
      scrollToSection(hash.replace('#', ''));
    }
  }, [loading, scrollToSection]);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await BlogService.listPosts({ pageSize: 12 });
      setPosts(res.posts);
      setCursor(res.cursor);
      setHasMore(!!res.cursor);
      setFeaturedPosts(res.posts.filter(p => p.featured).slice(0, 4));
      setLatestPosts(
        res.posts
          .filter(p => p.status === 'published')
          .sort((a, b) => {
            const bp = a.publishedAt;
            const ap = b.publishedAt;
            const bTime =
              typeof bp === 'object' && bp && 'seconds' in bp
                ? (bp as { seconds: number }).seconds * 1000
                : Date.parse(String(bp || '0'));
            const aTime =
              typeof ap === 'object' && ap && 'seconds' in ap
                ? (ap as { seconds: number }).seconds * 1000
                : Date.parse(String(ap || '0'));
            return bTime - aTime;
          })
          .slice(0, 3)
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Không thể tải bài viết.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!cursor) return;
    setLoadingMore(true);
    setError(null);
    try {
      const res = await BlogService.listPosts({ pageSize: 12, cursor });
      setPosts(prev => [...prev, ...res.posts]);
      setCursor(res.cursor);
      setHasMore(!!res.cursor);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Không thể tải thêm bài viết.');
    } finally {
      setLoadingMore(false);
    }
  }, [cursor]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadInitial();
  }, [loadInitial]);

  const filteredAndSortedPosts = useMemo(() => {
    const filtered = posts.filter(post => {
      if (post.status !== 'published') return false;
      const matchesSearch =
        searchTerm === '' ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.tags || []).some((tag: string) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesCategory =
        selectedCategory === 'all' ||
        post.categoryId === selectedCategory ||
        post.category?.id === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.viewCount || 0) - (a.viewCount || 0);
        case 'readTime':
          return a.readTime - b.readTime;
        default: {
          const bTime = b.publishedAt?.seconds
            ? b.publishedAt.seconds * 1000
            : Date.parse(b.publishedAt || '0');
          const aTime = a.publishedAt?.seconds
            ? a.publishedAt.seconds * 1000
            : Date.parse(a.publishedAt || '0');
          return bTime - aTime;
        }
      }
    });
  }, [searchTerm, selectedCategory, sortBy, posts]);

  const handleCategoryClick = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <PageHero
          id="blog-hero-heading"
          title="Blog Gia Sư Hoàng Hà"
          subtitle="Chia sẻ kiến thức, kinh nghiệm và tin tức giáo dục"
          logoClassName="w-[340px] h-[340px]"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 text-blue-700 dark:text-blue-200 mt-8">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>{posts.filter(p => p.status === 'published').length} bài viết</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span>{blogCategories.length} chủ đề</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Cập nhật hàng tuần</span>
            </div>
          </div>
        </PageHero>

        <div className="container-custom py-12">
          <BlogFeaturedSection loading={loading} featuredPosts={featuredPosts} />

          {loading ? (
            <section className="mb-12">
              <SkeletonLoading type="button" count={6} />
            </section>
          ) : (
            <BlogFilterBar
              selectedCategory={selectedCategory}
              categories={blogCategories}
              onCategoryClick={handleCategoryClick}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <BlogPostGrid
              loading={loading}
              loadingMore={loadingMore}
              error={error}
              posts={filteredAndSortedPosts}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              sortBy={sortBy}
              hasMore={hasMore}
              onSearchChange={setSearchTerm}
              onSortChange={setSortBy}
              onLoadMore={loadMore}
              onRetry={loadInitial}
            />

            <div id="sidebar" className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                <Card id="latest-posts">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="w-5 h-5 text-primary" />
                      Bài viết mới nhất
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    {latestPosts.map((post, index) => (
                      <div key={post.id}>
                        <BlogCard post={post} variant="compact" />
                        {index < latestPosts.length - 1 && <Separator className="mt-3" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="w-5 h-5 text-primary" />
                      Chủ đề
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {blogCategories.map(category => {
                        const postsCount = posts.filter(
                          p =>
                            (p.categoryId === category.id || p.category?.id === category.id) &&
                            p.status === 'published'
                        ).length;
                        return (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => handleCategoryClick(category.id)}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors text-left"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                              <span className="font-medium">{category.name}</span>
                            </div>
                            <Badge variant="secondary">{postsCount}</Badge>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tags phổ biến</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(posts.flatMap(post => post.tags || [])))
                        .slice(0, 15)
                        .map(tag => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                            onClick={() => setSearchTerm(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPage;
