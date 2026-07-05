'use client';

import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import ClassCard from '../components/shared/ClassCard';
import { Class } from '../types';
import classesService from '../services/firestore/classesService';
import {
  convertFirestoreClass,
  extractClassCategories,
  filterClassesByCategory,
} from '../utils/classHelpers';
import Chatbot from '../components/shared/Chatbot';
import PageHero from '../components/shared/PageHero';
import ErrorDisplay from '../components/shared/ErrorDisplay';
import SkeletonLoading from '../components/shared/SkeletonLoading';

const ClassesPage = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Set up real-time listener for active classes
    const unsubscribe = classesService.subscribeToActiveClasses((firestoreClasses: any[]) => {
      try {
        // Convert Firestore classes to Class type
        const classesData = firestoreClasses.map(convertFirestoreClass);
        setClasses(classesData);
        setFilteredClasses(classesData);

        // Extract unique categories from classes
        const uniqueCategories = extractClassCategories();
        setCategories(uniqueCategories);

        setLoading(false);
        setError(null);
      } catch (error: any) {
        console.error('Error processing classes:', error);
        setError(error.message || 'Không thể xử lý danh sách lớp học');
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const filtered = filterClassesByCategory(classes, selectedCategory);
    setFilteredClasses(filtered);
  }, [selectedCategory, classes]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  if (loading) {
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
          details={error}
          retryLabel="Thử lại"
        />
      </Layout>
    );
  }

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
              <button
                onClick={() => handleCategoryChange('all')}
                className={`btn-class-filter${selectedCategory === 'all' ? ' btn-class-filter-active' : ''}`}
              >
                Tất cả
              </button>

              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`btn-class-filter${selectedCategory === category ? ' btn-class-filter-active' : ''}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {filteredClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredClasses.map(classData => (
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

      {/* Chatbot */}
      <Chatbot />
    </Layout>
  );
};

export default ClassesPage;
