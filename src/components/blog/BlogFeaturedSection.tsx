import { TrendingUp } from 'lucide-react';
import BlogCard from './BlogCard';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { blogCategories } from '../../constants/blogData';

interface BlogFeaturedSectionProps {
  loading: boolean;
  featuredPosts: any[];
}

const BlogFeaturedSection = ({ loading, featuredPosts }: BlogFeaturedSectionProps) => {
  if (loading) {
    return (
      <section id="featured-posts" className="mb-16" aria-labelledby="featured-posts-heading">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-8 w-48" />
          <Separator className="flex-1 bg-gradient-to-r from-primary to-transparent" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      </section>
    );
  }

  if (featuredPosts.length === 0) return null;

  return (
    <section id="featured-posts" className="mb-16" aria-labelledby="featured-posts-heading">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 id="featured-posts-heading" className="text-3xl font-bold">
            Bài viết nổi bật
          </h2>
        </div>
        <Separator className="flex-1 bg-gradient-to-r from-primary to-transparent" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {featuredPosts.map(post => (
          <BlogCard
            key={post.id}
            post={{
              ...post,
              category: post.category || blogCategories.find(c => c.id === post.categoryId),
            }}
            variant="featured"
          />
        ))}
      </div>
    </section>
  );
};

export default BlogFeaturedSection;
