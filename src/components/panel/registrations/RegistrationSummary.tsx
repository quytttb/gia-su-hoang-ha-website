import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Users, Clock, CheckCircle, XCircle, TrendingUp, Calendar } from 'lucide-react';
import { Registration } from '../../../types';
import registrationsService from '../../../services/firestore/registrationsService';
import { formatDate } from '../../../utils/helpers';
import Link from 'next/link';

interface RegistrationSummaryProps {
  className?: string;
}

const RegistrationSummary: React.FC<RegistrationSummaryProps> = ({ className }) => {
  const [recentRegistrations, setRecentRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get recent registrations (last 10)
        const registrationsResult = await registrationsService.getRegistrations(
          {},
          { limit: 10, orderBy: [{ field: 'createdAt', direction: 'desc' }] }
        );

        if (registrationsResult.data) {
          // Convert to Registration type
          const convertedRegistrations: Registration[] = registrationsResult.data.map(reg => ({
            id: reg.id,
            type: reg.type || 'class',
            userId: reg.userId,
            classId: reg.classId,
            className: '',
            studentName: reg.studentName,
            studentPhone: reg.studentPhone,
            studentSchool: reg.studentSchool || '', // Trường học học viên
            parentName: reg.parentName,
            parentPhone: reg.parentPhone,
            parentAddress: reg.parentAddress, // Địa chỉ phụ huynh
            preferredSchedule: reg.preferredSchedule,
            notes: reg.notes,
            registrationDate: reg.createdAt?.toDate().toISOString() || '',
            status: reg.status,
            approvedBy: reg.approvedBy,
            approvedAt: reg.approvedAt?.toDate().toISOString(),
            rejectionReason: reg.rejectionReason,
          }));

          setRecentRegistrations(convertedRegistrations);

          // Calculate stats
          const total = convertedRegistrations.length;
          const pending = convertedRegistrations.filter(r => r.status === 'pending').length;
          const approved = convertedRegistrations.filter(r => r.status === 'approved').length;
          const rejected = convertedRegistrations.filter(r => r.status === 'rejected').length;

          setStats({ total, pending, approved, rejected });
        }
      } catch (error) {
        console.error('Error fetching registration summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statusConfig = {
    pending: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    approved: { label: 'Đã duyệt', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    rejected: { label: 'Đã từ chối', color: 'bg-red-100 text-red-800', icon: XCircle },
    cancelled: { label: 'Đã hủy', color: 'bg-gray-100 text-gray-800', icon: XCircle },
    completed: { label: 'Hoàn thành', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    matched: { label: 'Đã ghép cặp', color: 'bg-purple-100 text-purple-800', icon: Users },
    trial_scheduled: {
      label: 'Đã lên lịch thử',
      color: 'bg-indigo-100 text-indigo-800',
      icon: Calendar,
    },
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Đăng ký gần đây
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Đăng ký gần đây
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="text-lg font-semibold text-foreground">{stats.pending}</div>
            <div className="text-xs text-muted-foreground">Chờ duyệt</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="text-lg font-semibold text-foreground">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Tổng cộng</div>
          </div>
        </div>

        {/* Recent Registrations List */}
        <div className="space-y-3">
          {recentRegistrations.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Chưa có đăng ký nào
            </div>
          ) : (
            recentRegistrations.slice(0, 5).map(registration => {
              const StatusIcon = statusConfig[registration.status]?.icon || Users;
              return (
                <div
                  key={registration.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground text-sm truncate">
                        {registration.studentName}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(registration.registrationDate)}
                    </div>
                  </div>
                  <Badge className={`${statusConfig[registration.status]?.color} text-xs`}>
                    {statusConfig[registration.status]?.label}
                  </Badge>
                </div>
              );
            })
          )}
        </div>

        {/* View All Button */}
        {recentRegistrations.length > 0 && (
          <div className="pt-4 border-t">
            <Link href="/panel/registrations">
              <Button variant="outline" size="sm" className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                Xem tất cả đăng ký
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RegistrationSummary;
