import React from 'react';
import SkeletonLoading from '../shared/SkeletonLoading';

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section Skeleton */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-64 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full max-w-md"></div>
      </div>

      {/* Quick Stats Skeleton */}
      <SkeletonLoading type="stats-grid" />

      {/* Quick Actions Skeleton */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-32 mb-4"></div>
        <SkeletonLoading type="action-grid" />
      </div>

      {/* Additional Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-32 mb-4"></div>
          <div className="space-y-3">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2"></div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-32 mb-4"></div>
          <SkeletonLoading type="text" count={5} />
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
