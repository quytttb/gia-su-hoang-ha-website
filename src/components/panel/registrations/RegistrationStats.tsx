import React from 'react';
import { Users, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import SkeletonLoading from '@/components/shared/SkeletonLoading';

interface RegistrationStatsProps {
  stats: {
    totalRegistrations: number;
    pendingRegistrations: number;
    approvedRegistrations: number;
    rejectedRegistrations: number;
    recentRegistrations: number;
  };
  loading?: boolean;
}

const RegistrationStats: React.FC<RegistrationStatsProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SkeletonLoading type="stats-grid" />
      </div>
    );
  }

  const cards = [
    {
      title: 'Tổng đăng ký',
      value: stats.totalRegistrations,
      icon: Users,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'Chờ duyệt',
      value: stats.pendingRegistrations,
      icon: Clock,
      iconBg: 'bg-accent/20',
      iconColor: 'text-accent-foreground',
    },
    {
      title: 'Đã duyệt',
      value: stats.approvedRegistrations,
      icon: CheckCircle,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'Từ chối',
      value: stats.rejectedRegistrations,
      icon: XCircle,
      iconBg: 'bg-destructive/10',
      iconColor: 'text-destructive',
    },
    {
      title: 'Đăng ký gần đây',
      value: stats.recentRegistrations,
      icon: TrendingUp,
      iconBg: 'bg-muted',
      iconColor: 'text-foreground',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${card.iconBg}`}>
                  <Icon className={`h-6 w-6 ${card.iconColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold text-foreground">
                    {card.value.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default RegistrationStats;
