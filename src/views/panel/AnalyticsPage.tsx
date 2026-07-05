import React, { useState, useEffect } from 'react';
import AnalyticsDashboard from '../../components/panel/AnalyticsDashboard';
import ClassesStats from '../../components/panel/ClassesStats';
import SkeletonLoading from '../../components/shared/SkeletonLoading';

const AnalyticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for analytics data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-2xl font-bold text-foreground mb-2">Analytics</h2>
          <p className="text-muted-foreground">
            Xem báo cáo chi tiết và phân tích dữ liệu hoạt động của trung tâm.
          </p>
        </div>

        {/* Analytics Components */}
        {loading ? (
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6 border">
              <SkeletonLoading type="text" count={3} />
            </div>
            <div className="bg-card rounded-lg p-6 border">
              <SkeletonLoading type="text" count={5} />
            </div>
          </div>
        ) : (
          <>
            <ClassesStats />
            <AnalyticsDashboard />
          </>
        )}
      </div>
    </>
  );
};

export default AnalyticsPage;
