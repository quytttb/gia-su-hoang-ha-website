'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import SectionHeading from '@/components/shared/SectionHeading';
import {
  calculateDiscountedPrice,
  formatCurrency,
  formatDate,
  hasValidDiscount,
} from '@/utils/helpers';
import { generateClassStructuredData } from '@/utils/seo';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Chatbot from '@/components/shared/Chatbot';
import { parseMarkdown } from '@/utils/parseMarkdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Class, Schedule } from '@/types';

interface ClassDetailScreenProps {
  course: Class | null;
  schedules: Schedule[];
}

const ClassDetailScreen = ({ course, schedules }: ClassDetailScreenProps) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [course?.id]);

  if (!course) {
    return (
      <Layout>
        <div className="container-custom py-20 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Không tìm thấy lớp học</h2>
          <p className="text-muted-foreground mb-8">
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

      <section className="bg-muted py-16">
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
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{course.name}</h1>
              <div className="text-muted-foreground mb-6">{parseMarkdown(course.description)}</div>

              <Card className="shadow-md">
                <CardContent className="p-6">
                  <div className="mb-4 space-y-2">
                    <p className="text-foreground">
                      <strong>Lịch học:</strong> thứ 2 đến 4
                    </p>
                    <p className="text-foreground">
                      <strong>Giờ học:</strong> 19:30 đến 21:30
                    </p>
                    <p className="text-foreground">
                      <strong>Số lượng:</strong> 12
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div>
                      {hasValidDiscountValue ? (
                        <div>
                          <span className="text-muted-foreground line-through text-sm block">
                            {formatCurrency(course.price)}
                          </span>
                          <span className="text-primary font-bold text-2xl">
                            {formatCurrency(finalPrice)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-primary font-bold text-2xl">
                          {formatCurrency(course.price)}
                        </span>
                      )}
                    </div>

                    {hasValidDiscountValue && (
                      <Badge variant="destructive" className="font-semibold px-3 py-1 text-sm">
                        Giảm {course.discount}% đến{' '}
                        {course.discountEndDate && formatDate(course.discountEndDate)}
                      </Badge>
                    )}
                  </div>

                  <Button asChild className="w-full">
                    <Link href={`/classes/${course.id}/register`}>Đăng ký lớp học</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="rounded-lg overflow-hidden shadow-lg flex items-center justify-center bg-card">
              <img
                src={course.imageUrl}
                alt={course.name}
                className="w-full max-w-[1180px] h-auto aspect-[1180/800] object-contain bg-card"
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
              description="Các buổi học được lên lịch cho lớp học này"
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

export default ClassDetailScreen;
