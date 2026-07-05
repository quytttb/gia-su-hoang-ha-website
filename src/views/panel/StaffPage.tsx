import React, { useState, useEffect } from 'react';
import SkeletonLoading from '../../components/shared/SkeletonLoading';

const StaffPage: React.FC = () => {
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
          <h2 className="text-2xl font-bold text-foreground mb-2">Quản lý Nhân viên</h2>
          <p className="text-muted-foreground">
            Quản lý tài khoản và quyền hạn của nhân viên trong hệ thống.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-card rounded-lg p-6 border">
            <SkeletonLoading type="table-row" count={8} />
          </div>
        ) : (
          <div className="bg-card rounded-lg p-12 border text-center">
            <h3 className="text-xl font-semibold text-foreground mb-4">Đang phát triển</h3>
            <p className="text-muted-foreground">
              Tính năng quản lý nhân viên sẽ được triển khai trong Phase 2.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default StaffPage;
