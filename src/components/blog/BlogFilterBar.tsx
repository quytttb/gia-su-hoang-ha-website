import { Filter } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlogCategory } from '../../types';

interface BlogFilterBarProps {
  selectedCategory: string;
  categories: BlogCategory[];
  onCategoryClick: (categoryId: string) => void;
}

const BlogFilterBar = ({ selectedCategory, categories, onCategoryClick }: BlogFilterBarProps) => (
  <section id="categories" className="mb-12" aria-labelledby="categories-heading">
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <h3
        id="categories-heading"
        className="text-xl font-semibold flex items-center gap-2 shrink-0"
      >
        <Filter className="w-5 h-5 text-primary" aria-hidden="true" />
        Chủ đề
      </h3>
      <Tabs value={selectedCategory} onValueChange={onCategoryClick} className="flex-1 min-w-0">
        <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
          <TabsTrigger
            value="all"
            className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Tất cả
          </TabsTrigger>
          {categories.map(category => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="rounded-full data-[state=active]:text-white"
              style={
                selectedCategory === category.id
                  ? { backgroundColor: category.color, borderColor: category.color }
                  : { borderColor: category.color, color: category.color }
              }
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  </section>
);

export default BlogFilterBar;
