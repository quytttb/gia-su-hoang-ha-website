import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogCategory } from '../../types';

interface BlogFilterBarProps {
  selectedCategory: string;
  categories: BlogCategory[];
  onCategoryClick: (categoryId: string) => void;
}

const BlogFilterBar = ({ selectedCategory, categories, onCategoryClick }: BlogFilterBarProps) => (
  <section id="categories" className="mb-12" aria-labelledby="categories-heading">
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <h3 id="categories-heading" className="text-xl font-semibold flex items-center gap-2">
        <Filter className="w-5 h-5 text-primary" />
        Chủ đề
      </h3>
      <Button
        variant={selectedCategory === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onCategoryClick('all')}
        className="rounded-full"
      >
        Tất cả
      </Button>
      {categories.map(category => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryClick(category.id)}
          className="rounded-full"
          style={
            selectedCategory === category.id
              ? { backgroundColor: category.color, borderColor: category.color, color: 'white' }
              : { borderColor: category.color, color: category.color }
          }
        >
          {category.name}
        </Button>
      ))}
    </div>
  </section>
);

export default BlogFilterBar;
