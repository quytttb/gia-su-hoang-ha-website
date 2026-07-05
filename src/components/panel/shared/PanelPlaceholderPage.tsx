'use client';

import { useState, useEffect } from 'react';
import PanelPageHeader from './PanelPageHeader';
import PanelTableSkeleton from './PanelTableSkeleton';
import { Card, CardContent } from '@/components/ui/card';
import SkeletonLoading from '@/components/shared/SkeletonLoading';

interface PanelPlaceholderPageProps {
  title: string;
  description: string;
  message: string;
  loadingVariant?: 'table' | 'text';
  simulateMs?: number;
}

const PanelPlaceholderPage = ({
  title,
  description,
  message,
  loadingVariant = 'table',
  simulateMs = 500,
}: PanelPlaceholderPageProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), simulateMs);
    return () => clearTimeout(timer);
  }, [simulateMs]);

  return (
    <div className="space-y-6">
      <PanelPageHeader title={title} description={description} />

      {loading ? (
        loadingVariant === 'table' ? (
          <PanelTableSkeleton count={8} />
        ) : (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <SkeletonLoading type="text" count={4} />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <SkeletonLoading type="text" count={3} />
              </CardContent>
            </Card>
          </div>
        )
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-4">Đang phát triển</h3>
            <p className="text-muted-foreground">{message}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PanelPlaceholderPage;
