import React from 'react';

type SkeletonType =
  | 'banner'
  | 'card'
  | 'text'
  | 'avatar'
  | 'button'
  | 'table-row'
  | 'stats-grid'
  | 'action-grid';

interface SkeletonLoadingProps {
  type: SkeletonType;
  count?: number;
  width?: string;
  height?: string;
  className?: string;
}

const SkeletonLoading: React.FC<SkeletonLoadingProps> = ({
  type,
  count = 1,
  width,
  height,
  className = '',
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'banner':
        return (
          <div
            className={`h-[400px] w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl ${className}`}
            style={{ width, height }}
          />
        );

      case 'card':
        return Array(count)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className={`bg-gray-100 dark:bg-gray-700 rounded-lg h-72 w-full max-w-[400px] mx-auto ${className}`}
              style={{ width, height }}
            >
              <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-t-lg" />
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
              </div>
            </div>
          ));

      case 'stats-grid':
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
              ))}
          </div>
        );

      case 'action-grid':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 animate-pulse"
                >
                  <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              ))}
          </div>
        );

      case 'text':
        return Array(count)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className={`h-6 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 ${className}`}
              style={{ width, height }}
            />
          ));

      case 'avatar':
        return (
          <div
            className={`rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`}
            style={{ width: width || '48px', height: height || '48px' }}
          />
        );

      case 'button':
        return (
          <div
            className={`h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse ${className}`}
            style={{ width: width || '120px', height }}
          />
        );

      case 'table-row':
        return Array(count)
          .fill(0)
          .map((_, i) => (
            <div key={i} className={`flex space-x-2 mb-2 ${className}`}>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            </div>
          ));

      default:
        return <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />;
    }
  };

  return <>{renderSkeleton()}</>;
};

export default SkeletonLoading;
