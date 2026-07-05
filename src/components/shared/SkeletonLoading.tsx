import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type SkeletonType =
  | 'banner'
  | 'card'
  | 'text'
  | 'avatar'
  | 'button'
  | 'table-row'
  | 'stats-grid'
  | 'action-grid'
  | 'dashboard';

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
          <Skeleton
            className={cn('h-[400px] w-full rounded-xl', className)}
            style={{ width, height }}
          />
        );

      case 'card':
        return Array(count)
          .fill(0)
          .map((_, i) => (
            <Card
              key={i}
              className={cn('h-72 w-full max-w-[400px] mx-auto overflow-hidden', className)}
            >
              <Skeleton className="h-40 w-full rounded-none rounded-t-lg" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ));

      case 'stats-grid':
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6 space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-24" />
                  </CardContent>
                </Card>
              ))}
          </div>
        );

      case 'action-grid':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex flex-col items-center p-4 rounded-lg border">
                  <Skeleton className="h-12 w-12 rounded-lg mb-2" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
          </div>
        );

      case 'text':
        return Array(count)
          .fill(0)
          .map((_, i) => (
            <Skeleton
              key={i}
              className={cn('h-6 w-full mb-2', className)}
              style={{ width, height }}
            />
          ));

      case 'avatar':
        return (
          <Skeleton
            className={cn('rounded-full', className)}
            style={{ width: width || '48px', height: height || '48px' }}
          />
        );

      case 'button':
        return (
          <Skeleton
            className={cn('h-10 rounded-lg', className)}
            style={{ width: width || '120px', height }}
          />
        );

      case 'table-row':
        return Array(count)
          .fill(0)
          .map((_, i) => (
            <div key={i} className={cn('flex space-x-2 mb-2', className)}>
              <Skeleton className="h-10 w-1/4" />
              <Skeleton className="h-10 w-1/4" />
              <Skeleton className="h-10 w-1/4" />
              <Skeleton className="h-10 w-1/4" />
            </div>
          ));

      case 'dashboard':
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-full max-w-md" />
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6 space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-3 w-24" />
                    </CardContent>
                  </Card>
                ))}
            </div>
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex flex-col items-center p-4 rounded-lg border">
                        <Skeleton className="h-12 w-12 rounded-lg mb-2" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="space-y-3">
                    {Array(3)
                      .fill(0)
                      .map((_, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="flex-1 space-y-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-32 mb-4" />
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-6 w-full mb-2" />
                    ))}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return <Skeleton className="h-10 w-full" />;
    }
  };

  return <>{renderSkeleton()}</>;
};

export default SkeletonLoading;
