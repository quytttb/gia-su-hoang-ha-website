import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import SkeletonLoading from '@/components/shared/SkeletonLoading';
import { getAllClasses } from '@/data/classes';
import { Class } from '../../types';

interface ClassStats {
  totalClasses: number;
  activeClasses: number;
  totalStudents: number;
  averagePrice: number;
  popularSubjects: { subject: string; count: number }[];
  recentEnrollments: number;
}

const computeClassStats = (classes: Class[]): ClassStats => {
  const activeClasses = classes.filter(c => c.isActive !== false);
  const averagePrice =
    classes.length > 0 ? classes.reduce((sum, c) => sum + c.price, 0) / classes.length : 0;

  const categoryCounts: Record<string, number> = {};
  classes.forEach(c => {
    const category = c.category || 'Khác';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  const popularSubjects = Object.entries(categoryCounts)
    .map(([subject, count]) => ({ subject, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return {
    totalClasses: classes.length,
    activeClasses: activeClasses.length,
    totalStudents: 0,
    averagePrice,
    popularSubjects,
    recentEnrollments: 0,
  };
};

const ClassesStats = () => {
  const [stats, setStats] = useState<ClassStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const classes = await getAllClasses();
      setStats(computeClassStats(classes));
    } catch (err) {
      console.error('Error loading class stats:', err);
      setError('Không thể tải thống kê lớp học');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStats();
    const handler = () => {
      void loadStats();
    };
    window.addEventListener('panel-global-refresh', handler as EventListener);
    return () => window.removeEventListener('panel-global-refresh', handler as EventListener);
  }, [loadStats]);

  if (loading) {
    return (
      <Card className="transition-colors duration-200">
        <CardContent className="p-6">
          <SkeletonLoading type="stats-grid" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="transition-colors duration-200">
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertDescription className="text-center">⚠️ {error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-colors duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Thống kê lớp học</h2>
        </div>

        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary">{stats.totalClasses}</div>
                <div className="text-sm text-muted-foreground">Tổng lớp học</div>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary">{stats.activeClasses}</div>
                <div className="text-sm text-muted-foreground">Đang hoạt động</div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{stats.totalStudents}</div>
                <div className="text-sm text-muted-foreground">Tổng học viên</div>
              </div>

              <div className="bg-accent/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-accent-foreground">
                  {new Intl.NumberFormat('vi-VN').format(Math.round(stats.averagePrice))}đ
                </div>
                <div className="text-sm text-muted-foreground">Giá trung bình</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Môn học phổ biến</h3>
                <div className="space-y-2">
                  {stats.popularSubjects.length === 0 && (
                    <p className="text-sm text-muted-foreground">Chưa có dữ liệu</p>
                  )}
                  {stats.popularSubjects.slice(0, 5).map(subject => (
                    <div key={subject.subject} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{subject.subject}</span>
                      <div className="flex items-center">
                        <Progress
                          value={
                            stats.popularSubjects[0]?.count
                              ? (subject.count / stats.popularSubjects[0].count) * 100
                              : 0
                          }
                          className="w-20 h-2 mr-2"
                        />
                        <span className="text-sm text-muted-foreground">{subject.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Hoạt động gần đây</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted dark:bg-muted rounded">
                    <span className="text-muted-foreground">Đăng ký mới (30 ngày)</span>
                    <span className="font-semibold text-primary">{stats.recentEnrollments}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ClassesStats;
