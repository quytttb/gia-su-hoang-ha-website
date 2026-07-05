'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Layout from '../components/layout/Layout';
import SectionHeading from '../components/shared/SectionHeading';
import { Class, Schedule } from '../types';
import classesService from '../services/firestore/classesService';
import schedulesService from '../services/firestore/schedulesService';
import {
  calculateDiscountedPrice,
  formatCurrency,
  formatDate,
  hasValidDiscount,
} from '../utils/helpers';
import { generateClassStructuredData } from '../utils/seo';
import { convertFirestoreClass } from '../utils/classHelpers';
import Breadcrumb from '../components/shared/Breadcrumb';
import Chatbot from '../components/shared/Chatbot';
import { parseMarkdown } from '../utils/parseMarkdown';

const CourseDetailPage = () => {
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === 'string' ? params.id : '';
  const [course, setCourse] = useState<Class | undefined>(undefined);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // Get course from Firestore
        const courseResult = await classesService.getById(id);
        const schedulesData = await schedulesService.getByClassId(id);

        if (courseResult.data) {
          setCourse(convertFirestoreClass(courseResult.data));
        }
        setSchedules(schedulesData);
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Scroll to top when component mounts or id changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="container-custom py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy lớp học</h2>
          <p className="text-gray-600 mb-8">
            Lớp học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link href="/classes" className="btn-primary">
            Quay lại danh sách lớp học
          </Link>
        </div>
      </Layout>
    );
  }

  const hasValidDiscountValue = hasValidDiscount(course.discount, course.discountEndDate);
  const finalPrice = hasValidDiscountValue
    ? calculateDiscountedPrice(course.price, course.discount)
    : course.price;

  return (
    <Layout>
      {course && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateClassStructuredData(course)),
          }}
        />
      )}

      {/* Hero Section */}
      <section className="bg-gray-100 dark:bg-gray-900 py-16">
        <div className="container-custom">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Lớp học', href: '/classes' },
              { label: course.name },
            ]}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {course.name}
              </h1>
              <div className="text-gray-600 dark:text-gray-400 mb-6">
                {parseMarkdown(course.description)}
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="mb-4 space-y-2">
                  <p className="text-gray-700 dark:text-gray-200">
                    <strong>Lịch học:</strong> thứ 2 đến 4
                  </p>
                  <p className="text-gray-700 dark:text-gray-200">
                    <strong>Giờ học:</strong> 19:30 đến 21:30
                  </p>
                  <p className="text-gray-700 dark:text-gray-200">
                    <strong>Số lượng:</strong> 12
                  </p>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    {hasValidDiscountValue ? (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 line-through text-sm block">
                          {formatCurrency(course.price)}
                        </span>
                        <span className="text-primary font-bold text-2xl dark:text-gray-200">
                          {formatCurrency(finalPrice)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-primary font-bold text-2xl dark:text-gray-200">
                        {formatCurrency(course.price)}
                      </span>
                    )}
                  </div>

                  {hasValidDiscountValue && (
                    <div className="bg-primary text-white px-3 py-1 rounded-lg dark:bg-gray-700">
                      Giảm {course.discount}% đến{' '}
                      {course.discountEndDate && formatDate(course.discountEndDate)}
                    </div>
                  )}
                </div>

                {/* Registration Button */}
                <Link
                  href={`/classes/${course.id}/register`}
                  className="btn-primary w-full text-center inline-block"
                >
                  Đăng ký lớp học
                </Link>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden shadow-lg flex items-center justify-center bg-white dark:bg-gray-800">
              <img
                src={course.imageUrl}
                alt={course.name}
                className="w-full max-w-[1180px] h-auto aspect-[1180/800] object-contain bg-white dark:bg-gray-800"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      {schedules.length > 0 && (
        <section className="section-padding">
          <div className="container-custom">
            <SectionHeading
              title="Lịch học sắp tới"
              subtitle="Các buổi học được lên lịch cho lớp học này"
            />

            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <thead className="bg-gray-100 dark:bg-gray-900">
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-800 dark:text-gray-200">
                      Ngày học
                    </th>
                    <th className="py-3 px-4 text-left text-gray-800 dark:text-gray-200">
                      Thời gian
                    </th>
                    <th className="py-3 px-4 text-left text-gray-800 dark:text-gray-200">
                      Giáo viên
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map(schedule => (
                    <tr key={schedule.id} className="border-t border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-200">
                        {formatDate(schedule.startDate)}
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-200">
                        {schedule.startTime} - {schedule.endTime}
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-200">
                        {schedule.tutorName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Related Courses - would be implemented in a real app */}

      <Chatbot />
    </Layout>
  );
};

export default CourseDetailPage;
