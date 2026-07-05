import React, { useState, useEffect } from 'react';
import SkeletonLoading from '../../components/shared/SkeletonLoading';

const SettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-2xl font-bold text-foreground mb-2">Cài đặt Hệ thống</h2>
          <p className="text-muted-foreground">
            Cấu hình các thiết lập chung của hệ thống và ứng dụng.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6 border">
              <SkeletonLoading type="text" count={4} />
            </div>
            <div className="bg-card rounded-lg p-6 border">
              <SkeletonLoading type="text" count={3} />
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-lg p-12 border text-center">
            <h3 className="text-xl font-semibold text-foreground mb-4">Đang phát triển</h3>
            <p className="text-muted-foreground">
              Tính năng cài đặt hệ thống sẽ được triển khai trong giai đoạn tiếp theo.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default SettingsPage;
