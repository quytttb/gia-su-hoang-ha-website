'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Layout from '../components/layout/Layout';
import BlogCard from '../components/blog/BlogCard';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  User,
  Share2,
  Facebook,
  Linkedin,
  Copy,
  BookOpen,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { blogCategories } from '../constants/blogData';
import { BlogService } from '../services/blogService';
import ErrorDisplay from '../components/shared/ErrorDisplay';
import Breadcrumb from '../components/shared/Breadcrumb';
import { generateBlogStructuredData } from '../utils/seo';

// Minimal X (Twitter) icon
const XIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M18.146 2H21.5l-7.41 8.457L23 22h-6.845l-5.365-7.02L4.6 22H1.25l7.93-9.04L1 2h6.97l4.842 6.354L18.146 2Zm-2.4 17.94h2.22L8.36 3.94H6.01l9.736 16Z" />
  </svg>
);

const BlogDetailPage: React.FC = () => {
  const params = useParams<{ slug: string }>();
  const slug = typeof params?.slug === 'string' ? params.slug : '';
  const router = useRouter();
  const [post, setPost] = useState<any | null>(null);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!slug) return;
      const normalizedSlug = decodeURIComponent(slug).trim();
      setLoading(true);
      try {
        let p: any | null = null;
        try {
          p = await BlogService.getPostBySlug(normalizedSlug);
        } catch {
          p = null;
        }
        // Fallback: if no post found by slug, try interpret param as document ID
        if (!p) {
          try {
            // Try as published id first
            p = await BlogService.getPostById(normalizedSlug, false);
          } catch {
            p = null;
          }
          if (!p) {
            try {
              // Finally try including drafts (may be denied by rules for public users)
              p = await BlogService.getPostById(normalizedSlug, true);
            } catch {
              p = null;
            }
          }
        }
        if (!active) return;
        if (p) {
          // map category object if available
          const pAny: any = p;
          const catId = pAny.categoryId || pAny.category?.id;
          const category = pAny.category || blogCategories.find(c => c.id === catId);
          setPost({ ...pAny, category });
          // latest posts
          const latestRes = await BlogService.listPosts({ pageSize: 8 });
          const others = latestRes.posts.filter(x => x.id !== p.id);
          setLatestPosts(others.slice(0, 4));
          // related simple: same category or overlapping tags
          const related = others
            .filter(r => {
              const rAny: any = r;
              const rCat = rAny.categoryId || rAny.category?.id;
              const pCat = pAny.categoryId || pAny.category?.id;
              return (
                (rCat && pCat && rCat === pCat) ||
                (rAny.tags && pAny.tags && rAny.tags.some((t: string) => pAny.tags.includes(t)))
              );
            })
            .slice(0, 3);
          setRelatedPosts(related);
          // Increment view count (session guard)
          const viewedKey = `viewedPost:${p.id}`;
          if (!sessionStorage.getItem(viewedKey)) {
            sessionStorage.setItem(viewedKey, '1');
            BlogService.incrementViewCount(p.id).catch(() => {});
          }
        } else {
          setPost(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [slug]);

  // Scroll to top when component mounts or ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading && !post) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center text-muted-foreground">Đang tải bài viết...</div>
        </div>
      </Layout>
    );
  }

  if (!loading && !post) {
    return (
      <Layout>
        <div className="container-custom py-16">
          <ErrorDisplay
            fullPage={false}
            type="warning"
            message="Không tìm thấy bài viết"
            details="Bài viết có thể đã bị xóa hoặc URL không đúng."
            retryLabel="Về trang Blog"
            onRetry={() => router.push('/blog')}
          />
        </div>
      </Layout>
    );
  }

  const formatDate = (dateValue: any) => {
    let d: Date;
    if (!dateValue) d = new Date();
    else if (typeof dateValue === 'string') d = new Date(dateValue);
    else if (dateValue?.seconds) d = new Date(dateValue.seconds * 1000);
    else d = new Date();
    return format(d, 'dd MMMM yyyy', { locale: vi });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post.title;

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'x':
        // X (formerly Twitter)
        shareUrl = `https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <Layout>
      {post && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              generateBlogStructuredData({
                title: post.title,
                excerpt: post.excerpt,
                slug: post.slug || slug,
                imageUrl: post.coverImage?.url || post.imageUrl,
                author: post.author,
                publishedAt: post.publishedAt,
                updatedAt: post.updatedAt,
              })
            ),
          }}
        />
      )}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom pt-6">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: post?.title || 'Bài viết' },
            ]}
          />
        </div>
        {/* Hero Image */}
        <div className="relative h-[60vh] overflow-hidden">
          <img
            src={post?.coverImage?.url || post?.imageUrl || '/images/placeholder-logo.svg'}
            alt={post?.title || 'Bài viết'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

          {/* Back Button */}
          <div className="absolute top-6 left-6">
            <Button
              variant="secondary"
              size="sm"
              asChild
              className="backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              <Link href="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại Blog
              </Link>
            </Button>
          </div>

          {/* Article Meta */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="container-custom">
              <div className="max-w-4xl">
                <Badge
                  className="mb-4 font-medium"
                  style={{ backgroundColor: post?.category?.color, color: 'white' }}
                >
                  {post?.category?.name || 'Chủ đề'}
                </Badge>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-white drop-shadow-md dark:text-white">
                  {post?.title || ''}
                </h1>

                {post?.subtitle && (
                  <p className="text-lg md:text-xl text-gray-200 mb-6 leading-relaxed">
                    {post.subtitle}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post?.author || post?.authorName || 'Ẩn danh'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{post?.publishedAt ? formatDate(post.publishedAt) : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{post?.readTime || 0} phút đọc</span>
                  </div>
                  {post?.viewCount != null && (
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{post?.viewCount?.toLocaleString()} lượt xem</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card className="mb-8">
                <CardContent className="p-8">
                  {/* Article Content */}
                  <div
                    className="prose prose-lg max-w-none dark:prose-invert
                      prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                      prose-p:text-gray-700 dark:prose-p:text-gray-300
                      prose-p:leading-relaxed
                      prose-strong:text-gray-900 dark:prose-strong:text-gray-100
                      prose-a:text-primary hover:prose-a:text-primary-600"
                    dangerouslySetInnerHTML={{ __html: post?.contentHtml || post?.content || '' }}
                  />

                  {/* Tags */}
                  <div className="mt-8 pt-6 border-t">
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {(post.tags || []).map((tag: string) => (
                        <Link key={tag} href={`/blog?search=${encodeURIComponent(tag)}`}>
                          <Badge
                            variant="secondary"
                            className="hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            {tag}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Share Buttons */}
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">
                      Chia sẻ bài viết:
                    </h4>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare('facebook')}
                        className="flex items-center gap-2"
                      >
                        <Facebook className="w-4 h-4" />
                        Facebook
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare('x')}
                        className="flex items-center gap-2"
                      >
                        <XIcon className="w-4 h-4" />X
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare('linkedin')}
                        className="flex items-center gap-2"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare('copy')}
                        className="flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-6 h-6 text-primary" />
                      <h2 className="text-2xl font-bold">Bài viết liên quan</h2>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-primary to-transparent"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedPosts.map(relatedPost => (
                      <BlogCard key={relatedPost.id} post={relatedPost} />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Author Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tác giả</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const displayAuthor = (post?.author ||
                        post?.authorName ||
                        'Ẩn danh') as string;
                      return (
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold">
                            {displayAuthor.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-semibold">{displayAuthor}</h4>
                            <p className="text-sm text-muted-foreground">Giáo viên</p>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>

                {/* Share Widget */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Share2 className="w-5 h-5 text-primary" />
                      Chia sẻ
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare('facebook')}
                        className="w-full"
                      >
                        <Facebook className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare('x')}
                        className="w-full"
                      >
                        <XIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare('linkedin')}
                        className="w-full"
                      >
                        <Linkedin className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare('copy')}
                        className="w-full"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Latest Posts */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="w-5 h-5 text-primary" />
                      Bài viết khác
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    {latestPosts.slice(0, 3).map((latestPost, index) => (
                      <div key={latestPost.id}>
                        <BlogCard post={latestPost} variant="compact" />
                        {index < latestPosts.slice(0, 3).length - 1 && (
                          <Separator className="mt-3" />
                        )}
                      </div>
                    ))}
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

export default BlogDetailPage;
