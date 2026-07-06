'use client';

import { useMemo } from 'react';
import { useQueryState } from 'nuqs';
import Layout from '@/components/layout/Layout';
import ClassCard from '@/components/shared/ClassCard';
import { Class } from '@/types';
import { extractClassCategories, filterClassesByCategory } from '@/utils/classHelpers';
import Chatbot from '@/components/shared/Chatbot';
import PageHero from '@/components/shared/PageHero';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ClassesScreenProps {
  initialClasses: Class[];
}

const ClassesScreen = ({ initialClasses }: ClassesScreenProps) => {
  const [selectedCategory, setSelectedCategory] = useQueryState('category', {
    defaultValue: 'all',
  });

  const classes = initialClasses;

  const categories = useMemo(() => extractClassCategories(), []);

  const filteredClasses = useMemo(
    () => filterClassesByCategory(classes, selectedCategory ?? 'all'),
    [classes, selectedCategory]
  );

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === 'all' ? null : category);
  };

  const activeCategory = selectedCategory ?? 'all';

  return (
    <Layout>
      <PageHero id="classes-hero-heading" title="Lớp Học">
        <p className="text-xl md:text-2xl font-semibold text-accent-600 dark:text-accent-500 max-w-4xl mx-auto flex flex-col items-center gap-2 whitespace-normal">
          Khám phá các lớp học chất lượng cao, được thiết kế phù hợp với mọi lứa tuổi và nhu cầu học
          tập
          <span className="block text-base font-medium text-primary-700 dark:text-primary-400 mt-1">
            {classes.length} lớp học đang mở
          </span>
        </p>
      </PageHero>
      <section className="section-padding" aria-labelledby="classes-list-heading">
        <div className="container-custom">
          <div className="mb-10">
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <Button
                variant="outline"
                onClick={() => handleCategoryChange('all')}
                className={cn(
                  activeCategory === 'all' &&
                    'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
                data-active={activeCategory === 'all'}
              >
                Tất cả
              </Button>

              {categories.map(category => (
                <Button
                  key={category}
                  variant="outline"
                  onClick={() => handleCategoryChange(category)}
                  className={cn(
                    activeCategory === category &&
                      'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                  data-active={activeCategory === category}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {filteredClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredClasses.map((classData: Class) => (
                <ClassCard key={classData.id} class={classData} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground text-lg">Không tìm thấy lớp học nào.</p>
            </div>
          )}
        </div>
      </section>

      <Chatbot />
    </Layout>
  );
};

export default ClassesScreen;
