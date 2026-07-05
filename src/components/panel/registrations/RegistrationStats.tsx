import React from 'react';
import { Users, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';

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
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg border p-6">
            <div className="animate-pulse">
              <div className="w-8 h-8 bg-muted rounded mb-2"></div>
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Tổng đăng ký',
      value: stats.totalRegistrations,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Chờ duyệt',
      value: stats.pendingRegistrations,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Đã duyệt',
      value: stats.approvedRegistrations,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Từ chối',
      value: stats.rejectedRegistrations,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Đăng ký gần đây',
      value: stats.recentRegistrations,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-card rounded-lg border p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold text-foreground">{card.value.toLocaleString()}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RegistrationStats;
