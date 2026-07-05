import { TrendingUp } from 'lucide-react';
import BlogCard from './BlogCard';
import SkeletonLoading from '../shared/SkeletonLoading';
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
          <SkeletonLoading type="text" count={1} width="200px" />
          <div className="flex-1 h-px bg-gradient-to-r from-primary to-transparent" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SkeletonLoading type="card" count={2} height="300px" />
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
        <div className="flex-1 h-px bg-gradient-to-r from-primary to-transparent" />
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
