'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import RegistrationTable from '@/components/panel/registrations/RegistrationTable';
import RegistrationStats from '@/components/panel/registrations/RegistrationStats';
import { Registration } from '@/types';
import { getRegistrations } from '@/data/registrations';
import { getClassById } from '@/data/classes';
import { approveRegistration, rejectRegistration } from '@/actions/registration';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PageRegistrationStats {
  totalRegistrations: number;
  pendingRegistrations: number;
  approvedRegistrations: number;
  rejectedRegistrations: number;
  recentRegistrations: number;
}

const computeRegistrationStats = (registrations: Registration[]): PageRegistrationStats => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return {
    totalRegistrations: registrations.length,
    pendingRegistrations: registrations.filter(r => r.status === 'pending').length,
    approvedRegistrations: registrations.filter(r => r.status === 'approved').length,
    rejectedRegistrations: registrations.filter(r => r.status === 'rejected').length,
    recentRegistrations: registrations.filter(r => {
      const date = new Date(r.registrationDate);
      return !Number.isNaN(date.getTime()) && date > sevenDaysAgo;
    }).length,
  };
};

const RegistrationsScreen: React.FC = () => {
  const searchParams = useSearchParams();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredClassName, setFilteredClassName] = useState<string>('');
  const [stats, setStats] = useState<PageRegistrationStats>({
    totalRegistrations: 0,
    pendingRegistrations: 0,
    approvedRegistrations: 0,
    rejectedRegistrations: 0,
    recentRegistrations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'class' | 'tutor'>('class');

  const classId = searchParams?.get('classId') ?? null;

  const fetchRegistrations = async () => {
    try {
      setLoading(true);

      if (activeTab === 'class' && classId) {
        const classRegistrations = await getRegistrations({ classId });
        setRegistrations(classRegistrations);

        try {
          const classData = await getClassById(classId);
          if (classData) {
            setFilteredClassName(classData.name);
          }
        } catch (err) {
          console.error('Error fetching class info:', err);
        }
      } else {
        const allRegistrations = await getRegistrations();
        setRegistrations(allRegistrations);
        setFilteredClassName('');
      }
    } catch {
      toast.error('Lỗi', { description: 'Không thể tải danh sách đăng ký' });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const allRegistrations = await getRegistrations();
      setStats(computeRegistrationStats(allRegistrations));
    } catch (err) {
      console.error('Error fetching registration stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    fetchStats();
  }, [classId, activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApprove = async (registrationId: string) => {
    if (!user) return;

    const result = await approveRegistration(registrationId, user.uid, user.email || 'Admin');
    if (!result.success) {
      throw new Error(result.error ?? 'Không thể duyệt đăng ký');
    }
  };

  const handleReject = async (registrationId: string, reason: string) => {
    if (!user) return;

    const result = await rejectRegistration(registrationId, reason, user.uid);
    if (!result.success) {
      throw new Error(result.error ?? 'Không thể từ chối đăng ký');
    }
  };

  const handleApproveMultiple = async (registrationIds: string[]) => {
    if (!user) return;

    const results = await Promise.allSettled(
      registrationIds.map(id => approveRegistration(id, user.uid, user.email || 'Admin'))
    );
    const failures = results.filter(
      result =>
        result.status === 'rejected' || (result.status === 'fulfilled' && !result.value.success)
    );

    if (failures.length > 0) {
      throw new Error(`Không thể duyệt ${failures.length} đăng ký`);
    }
  };

  const handleRejectMultiple = async (registrationIds: string[], reason: string) => {
    if (!user) return;

    const results = await Promise.allSettled(
      registrationIds.map(id => rejectRegistration(id, reason, user.uid))
    );
    const failures = results.filter(
      result =>
        result.status === 'rejected' || (result.status === 'fulfilled' && !result.value.success)
    );

    if (failures.length > 0) {
      throw new Error(`Không thể từ chối ${failures.length} đăng ký`);
    }
  };

  const handleRefresh = () => {
    fetchRegistrations();
    fetchStats();
  };

  useEffect(() => {
    const listener = () => handleRefresh();
    window.addEventListener('panel-global-refresh', listener);
    return () => window.removeEventListener('panel-global-refresh', listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, classId]);

  const classRegistrations = registrations.filter(r => r.type === 'class');
  const tutorRegistrations = registrations.filter(
    r => r.type === 'tutor_teacher' || r.type === 'tutor_student'
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {classId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.history.back()}
                  className="p-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h2 className="text-2xl font-bold text-foreground">
                {activeTab === 'class'
                  ? classId
                    ? `Đăng ký - ${filteredClassName}`
                    : 'Quản lý Đăng ký lớp học'
                  : 'Quản lý Đăng ký tìm gia sư'}
              </h2>
            </div>
            <p className="text-muted-foreground">
              {activeTab === 'class'
                ? classId
                  ? `Xem các đăng ký cho lớp học "${filteredClassName}"`
                  : 'Xem và xử lý các đăng ký lớp học từ học viên.'
                : 'Xem và xử lý các yêu cầu tìm gia sư từ phụ huynh.'}
            </p>
          </div>
        </div>

        <div className="flex space-x-4 border-b mb-6">
          <Button
            variant={activeTab === 'class' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('class')}
          >
            Đăng ký lớp học
          </Button>
          <Button
            variant={activeTab === 'tutor' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('tutor')}
          >
            Tìm gia sư
          </Button>
        </div>

        {activeTab === 'class' && (
          <>
            <RegistrationStats stats={stats} loading={statsLoading} />
            <RegistrationTable
              key="class"
              registrations={classRegistrations}
              loading={loading}
              onApprove={handleApprove}
              onReject={handleReject}
              onApproveMultiple={handleApproveMultiple}
              onRejectMultiple={handleRejectMultiple}
              onRefresh={handleRefresh}
            />
          </>
        )}

        {activeTab === 'tutor' && (
          <RegistrationTable
            key="tutor"
            registrations={tutorRegistrations}
            loading={loading}
            onApprove={handleApprove}
            onReject={handleReject}
            onApproveMultiple={handleApproveMultiple}
            onRejectMultiple={handleRejectMultiple}
            onRefresh={handleRefresh}
            isTutorTab={true}
          />
        )}
      </div>
    </>
  );
};

export default RegistrationsScreen;
