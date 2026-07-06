import { useState, useEffect } from 'react';
import Link from 'next/link';
import SkeletonLoading from '@/components/shared/SkeletonLoading';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PanelScreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        setError('Không thể tải trang tổng quan. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  if (loading) {
    return <SkeletonLoading type="dashboard" />;
  }

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Chào mừng trở lại!</h2>
            <p className="text-muted-foreground">
              Tổng quan về hoạt động hệ thống và các số liệu quan trọng.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground">Tổng lớp học</h3>
              <p className="text-2xl font-bold text-foreground">24</p>
              <p className="text-xs text-muted-foreground">+2 từ tháng trước</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground">Học viên hoạt động</h3>
              <p className="text-2xl font-bold text-foreground">1,234</p>
              <p className="text-xs text-muted-foreground">+15% từ tháng trước</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground">Đăng ký mới</h3>
              <p className="text-2xl font-bold text-foreground">89</p>
              <p className="text-xs text-muted-foreground">Tuần này</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground">Doanh thu</h3>
              <p className="text-2xl font-bold text-foreground">₫45.2M</p>
              <p className="text-xs text-muted-foreground">Tháng này</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Thao tác nhanh</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto flex-col p-4" asChild>
                <Link href="/panel/classes">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-primary text-xl">📚</span>
                  </div>
                  <span className="text-sm font-medium">Thêm lớp học</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col p-4" asChild>
                <Link href="/panel/schedules">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-primary text-xl">📅</span>
                  </div>
                  <span className="text-sm font-medium">Lập lịch</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col p-4" asChild>
                <Link href="/panel/registrations">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-primary text-xl">👥</span>
                  </div>
                  <span className="text-sm font-medium">Xem đăng ký</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col p-4" asChild>
                <Link href="/panel/analytics">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-primary text-xl">📊</span>
                  </div>
                  <span className="text-sm font-medium">Xem báo cáo</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PanelScreen;
