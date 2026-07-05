'use client';

import { useMemo } from 'react';
import { useQueryState } from 'nuqs';
import Layout from '../components/layout/Layout';
import ClassCard from '../components/shared/ClassCard';
import { Class } from '../types';
import {
  convertFirestoreClass,
  extractClassCategories,
  filterClassesByCategory,
} from '../utils/classHelpers';
import Chatbot from '../components/shared/Chatbot';
import PageHero from '../components/shared/PageHero';
import ErrorDisplay from '../components/shared/ErrorDisplay';
import SkeletonLoading from '../components/shared/SkeletonLoading';
import { Button } from '@/components/ui/button';
import { useActiveClasses } from '@/hooks/useClasses';
import { cn } from '@/lib/utils';

const ClassesPage = () => {
  const [selectedCategory, setSelectedCategory] = useQueryState('category', {
    defaultValue: 'all',
  });
  const { data: firestoreClasses, isLoading, error, refetch } = useActiveClasses();

  const classes = useMemo(
    () => (firestoreClasses ?? []).map(convertFirestoreClass),
    [firestoreClasses]
  );

  const categories = useMemo(() => extractClassCategories(), []);

  const filteredClasses = useMemo(
    () => filterClassesByCategory(classes, selectedCategory ?? 'all'),
    [classes, selectedCategory]
  );

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === 'all' ? null : category);
  };

  if (isLoading) {
    return (
      <Layout>
        <section className="bg-gray-100 dark:bg-gray-900 py-16">
          <div className="container-custom text-center">
            <SkeletonLoading type="text" count={2} className="mx-auto" />
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom">
            <div className="mb-8 text-center">
              <SkeletonLoading type="text" count={2} className="mx-auto" />
            </div>

            <div className="mb-10">
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {[...Array(5)].map((_, i) => (
                  <SkeletonLoading key={i} type="button" width="80px" />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <SkeletonLoading type="card" count={6} />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorDisplay
          message="Không thể tải danh sách lớp học"
          details={error.message}
          onRetry={() => refetch()}
          retryLabel="Thử lại"
        />
      </Layout>
    );
  }

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
              <p className="text-gray-500 text-lg">Không tìm thấy lớp học nào.</p>
            </div>
          )}
        </div>
      </section>

      <Chatbot />
    </Layout>
  );
};

export default ClassesPage;
