'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Layout from '../components/layout/Layout';
import SectionHeading from '../components/shared/SectionHeading';
import {
  calculateDiscountedPrice,
  formatCurrency,
  formatDate,
  hasValidDiscount,
} from '../utils/helpers';
import { generateClassStructuredData } from '../utils/seo';
import Breadcrumb from '../components/shared/Breadcrumb';
import Chatbot from '../components/shared/Chatbot';
import { parseMarkdown } from '../utils/parseMarkdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useClass } from '@/hooks/useClasses';
import { useClassSchedules } from '@/hooks/useSchedules';

const CourseDetailPage = () => {
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === 'string' ? params.id : '';
  const { data: course, isLoading: classLoading } = useClass(id);
  const { data: schedules = [], isLoading: schedulesLoading } = useClassSchedules(id);

  const loading = classLoading || schedulesLoading;

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
          <Button asChild>
            <Link href="/classes">Quay lại danh sách lớp học</Link>
          </Button>
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateClassStructuredData(course)),
        }}
      />

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

              <Card className="shadow-md">
                <CardContent className="p-6">
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

                  <Button asChild className="w-full">
                    <Link href={`/classes/${course.id}/register`}>Đăng ký lớp học</Link>
                  </Button>
                </CardContent>
              </Card>
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

      {schedules.length > 0 && (
        <section className="section-padding">
          <div className="container-custom">
            <SectionHeading
              title="Lịch học sắp tới"
              subtitle="Các buổi học được lên lịch cho lớp học này"
            />

            <Card className="shadow-md">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted hover:bg-muted">
                      <TableHead>Ngày học</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Giáo viên</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedules.map(schedule => (
                      <TableRow key={schedule.id}>
                        <TableCell>{formatDate(schedule.startDate)}</TableCell>
                        <TableCell>
                          {schedule.startTime} - {schedule.endTime}
                        </TableCell>
                        <TableCell>{schedule.tutorName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <Chatbot />
    </Layout>
  );
};

export default CourseDetailPage;
