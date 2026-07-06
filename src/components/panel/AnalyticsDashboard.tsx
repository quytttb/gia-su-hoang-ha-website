import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  GraduationCap,
  Eye,
  MousePointerClick,
  Clock,
  Trophy,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AnalyticsMetrics {
  totalUsers: number;
  pageViews: number;
  courseViews: number;
  registrations: number;
  chatbotInteractions: number;
  avgSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
}

interface TopPage {
  page: string;
  views: number;
  percentage: number;
}

interface TopCourse {
  name: string;
  views: number;
  registrations: number;
  conversionRate: number;
}

const metricAccentStyles = {
  primary: {
    border: 'border-l-primary',
    icon: 'bg-primary/10 text-primary',
    trend: 'text-primary',
  },
  success: {
    border: 'border-l-primary',
    icon: 'bg-primary/10 text-primary',
    trend: 'text-primary',
  },
  accent: {
    border: 'border-l-accent-foreground',
    icon: 'bg-accent/20 text-accent-foreground',
    trend: 'text-accent-foreground',
  },
  warning: {
    border: 'border-l-accent-foreground',
    icon: 'bg-accent/20 text-accent-foreground',
    trend: 'text-accent-foreground',
  },
  destructive: {
    border: 'border-l-destructive',
    icon: 'bg-destructive/10 text-destructive',
    trend: 'text-destructive',
  },
  muted: {
    border: 'border-l-muted-foreground',
    icon: 'bg-muted text-muted-foreground',
    trend: 'text-muted-foreground',
  },
} as const;

type MetricAccent = keyof typeof metricAccentStyles;

const AnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    totalUsers: 0,
    pageViews: 0,
    courseViews: 0,
    registrations: 0,
    chatbotInteractions: 0,
    avgSessionDuration: 0,
    bounceRate: 0,
    conversionRate: 0,
  });

  const [topPages] = useState<TopPage[]>([
    { page: 'Trang chủ', views: 1250, percentage: 35 },
    { page: 'Khóa học', views: 890, percentage: 25 },
    { page: 'Chi tiết lớp học', views: 650, percentage: 18 },
    { page: 'Liên hệ', views: 420, percentage: 12 },
    { page: 'Giới thiệu', views: 360, percentage: 10 },
  ]);

  const [topCourses] = useState<TopCourse[]>([
    { name: 'Toán lớp 10', views: 320, registrations: 45, conversionRate: 14.1 },
    { name: 'Lý lớp 11', views: 280, registrations: 38, conversionRate: 13.6 },
    { name: 'Hóa lớp 12', views: 250, registrations: 32, conversionRate: 12.8 },
    { name: 'Ôn thi THPT', views: 200, registrations: 28, conversionRate: 14.0 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalUsers: Math.floor(Math.random() * 50) + 1200,
        pageViews: Math.floor(Math.random() * 100) + 3500,
        courseViews: Math.floor(Math.random() * 30) + 850,
        registrations: Math.floor(Math.random() * 5) + 125,
        chatbotInteractions: Math.floor(Math.random() * 20) + 280,
        avgSessionDuration: Math.floor(Math.random() * 30) + 180,
        bounceRate: Math.floor(Math.random() * 10) + 35,
        conversionRate: Math.floor(Math.random() * 2) + 8,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    accent?: MetricAccent;
  }> = ({ title, value, icon, trend, accent = 'primary' }) => {
    const styles = metricAccentStyles[accent];
    return (
      <Card className={cn('border-l-4 shadow-md', styles.border)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              {trend && <p className={cn('text-sm mt-1', styles.trend)}>↗ {trend}</p>}
            </div>
            <div className={cn('p-3 rounded-full', styles.icon)}>{icon}</div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Cập nhật: {new Date().toLocaleTimeString('vi-VN')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Tổng người dùng"
          value={metrics.totalUsers.toLocaleString('de-DE')}
          icon={<Users className="h-6 w-6" />}
          trend="+12% tuần này"
          accent="primary"
        />
        <MetricCard
          title="Lượt xem trang"
          value={metrics.pageViews.toLocaleString('de-DE')}
          icon={<Eye className="h-6 w-6" />}
          trend="+8% tuần này"
          accent="success"
        />
        <MetricCard
          title="Xem lớp học"
          value={metrics.courseViews.toLocaleString('de-DE')}
          icon={<GraduationCap className="h-6 w-6" />}
          trend="+15% tuần này"
          accent="accent"
        />
        <MetricCard
          title="Đăng ký"
          value={metrics.registrations}
          icon={<Trophy className="h-6 w-6" />}
          trend="+22% tuần này"
          accent="warning"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Chatbot tương tác"
          value={metrics.chatbotInteractions}
          icon={<MousePointerClick className="h-6 w-6" />}
          accent="muted"
        />
        <MetricCard
          title="Thời gian trung bình"
          value={`${Math.floor(metrics.avgSessionDuration / 60)}:${(metrics.avgSessionDuration % 60).toString().padStart(2, '0')}`}
          icon={<Clock className="h-6 w-6" />}
          accent="accent"
        />
        <MetricCard
          title="Tỷ lệ thoát"
          value={`${metrics.bounceRate}%`}
          icon={<BarChart3 className="h-6 w-6" />}
          accent="destructive"
        />
        <MetricCard
          title="Tỷ lệ chuyển đổi"
          value={`${metrics.conversionRate}%`}
          icon={<Trophy className="h-6 w-6" />}
          accent="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Trang phổ biến nhất</h3>
            <div className="space-y-3">
              {topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{page.page}</span>
                      <span className="text-sm text-muted-foreground">
                        {page.views.toLocaleString('de-DE')}
                      </span>
                    </div>
                    <Progress value={page.percentage} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Lớp học phổ biến</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="uppercase text-xs">Lớp học</TableHead>
                    <TableHead className="text-right uppercase text-xs">Lượt xem</TableHead>
                    <TableHead className="text-right uppercase text-xs">Đăng ký</TableHead>
                    <TableHead className="text-right uppercase text-xs">Tỷ lệ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCourses.map((course, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{course.name}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {course.views}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {course.registrations}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="success">{course.conversionRate}%</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Hoạt động thời gian thực</h3>
          <div className="text-sm text-muted-foreground">
            <p>
              • Người dùng đang online: <span className="font-semibold text-primary">23</span>
            </p>
            <p>
              • Trang được xem nhiều nhất:{' '}
              <span className="font-semibold">Khóa học Toán lớp 10</span>
            </p>
            <p>
              • Chatbot đang hoạt động:{' '}
              <span className="font-semibold text-primary">5 cuộc hội thoại</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
