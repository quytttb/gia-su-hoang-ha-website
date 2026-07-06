import { useState, useEffect } from 'react';
import AnalyticsDashboard from '@/components/panel/AnalyticsDashboard';
import ClassesStats from '@/components/panel/ClassesStats';
import SkeletonLoading from '@/components/shared/SkeletonLoading';
import PanelPageHeader from '@/components/panel/shared/PanelPageHeader';
import { Card, CardContent } from '@/components/ui/card';

const AnalyticsScreen = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <PanelPageHeader
        title="Analytics"
        description="Xem báo cáo chi tiết và phân tích dữ liệu hoạt động của trung tâm."
      />

      {loading ? (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <SkeletonLoading type="text" count={3} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <SkeletonLoading type="text" count={5} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <ClassesStats />
          <AnalyticsDashboard />
        </>
      )}
    </div>
  );
};

export default AnalyticsScreen;
