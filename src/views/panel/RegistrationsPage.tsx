'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import RegistrationTable from '../../components/panel/registrations/RegistrationTable';
import RegistrationStats from '../../components/panel/registrations/RegistrationStats';
import { Registration } from '../../types';
import registrationsService from '../../services/firestore/registrationsService';
import classesService from '../../services/firestore/classesService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { convertFirestoreClass } from '../../utils/classHelpers';

interface PageRegistrationStats {
  totalRegistrations: number;
  pendingRegistrations: number;
  approvedRegistrations: number;
  rejectedRegistrations: number;
  recentRegistrations: number;
}

const RegistrationsPage: React.FC = () => {
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

      let result;
      if (activeTab === 'class' && classId) {
        // Filter by specific class
        result = await registrationsService.getRegistrations({ classId });

        // Get class name for display
        try {
          const classResult = await classesService.getById(classId);
          if (classResult.data) {
            const classData = convertFirestoreClass(classResult.data);
            setFilteredClassName(classData.name);
          }
        } catch (err) {
          console.error('Error fetching class info:', err);
        }
      } else {
        // Get all registrations (ignore class filter for tutor tab)
        result = await registrationsService.getRegistrations();
        setFilteredClassName('');
      }

      if (result.error) {
        toast.error('Lỗi', { description: result.error });
        return;
      }

      // Convert FirestoreRegistration to Registration
      const convertedRegistrations: Registration[] = result.data.map(reg => ({
        id: reg.id,
        userId: reg.userId,
        type: reg.type ?? 'class',
        classId: reg.classId,
        className: reg.className || '',
        // Map tutor-specific fields
        tutorType: reg.tutorType,
        tutorCriteria: reg.tutorCriteria || '',
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
        approvedByName: reg.approvedByName, // Thêm mapping tên người xử lý
        approvedAt: reg.approvedAt?.toDate().toISOString(),
        rejectionReason: reg.rejectionReason,
      }));

      setRegistrations(convertedRegistrations);
    } catch {
      toast.error('Lỗi', { description: 'Không thể tải danh sách đăng ký' });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const result = await registrationsService.getRegistrationStats();
      if (result.error) {
        console.error('Error fetching stats:', result.error);
        return;
      }

      if (result.data) {
        setStats(result.data);
      }
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

    const result = await registrationsService.approveRegistration(
      registrationId,
      user.uid,
      user.email || 'Admin'
    );
    if (result.error) {
      throw new Error(result.error);
    }
  };

  const handleReject = async (registrationId: string, reason: string) => {
    if (!user) return;

    const result = await registrationsService.rejectRegistration(registrationId, reason, user.uid);
    if (result.error) {
      throw new Error(result.error);
    }
  };

  const handleApproveMultiple = async (registrationIds: string[]) => {
    if (!user) return;

    const result = await registrationsService.bulkApproveRegistrations(registrationIds, user.uid);
    if (result.error) {
      throw new Error(result.error);
    }
  };

  const handleRejectMultiple = async (registrationIds: string[], reason: string) => {
    if (!user) return;

    // Since there's no bulk reject method, we'll reject one by one
    const promises = registrationIds.map(id =>
      registrationsService.rejectRegistration(id, reason, user.uid)
    );

    const results = await Promise.allSettled(promises);
    const failures = results.filter(result => result.status === 'rejected');

    if (failures.length > 0) {
      throw new Error(`Không thể từ chối ${failures.length} đăng ký`);
    }
  };

  // Unified refresh handler used by global refresh event and internal table actions
  const handleRefresh = () => {
    fetchRegistrations();
    fetchStats();
  };

  // Listen for global refresh events dispatched from header
  useEffect(() => {
    const listener = () => handleRefresh();
    window.addEventListener('panel-global-refresh', listener);
    return () => window.removeEventListener('panel-global-refresh', listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, classId]);

  // Split registrations by type
  const classRegistrations = registrations.filter(r => r.type === 'class');
  const tutorRegistrations = registrations.filter(
    r => r.type === 'tutor_teacher' || r.type === 'tutor_student'
  );

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
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
          {/* Local refresh button removed; use global refresh control in header */}
        </div>

        {/* Tabs */}
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
            {/* Stats Cards */}
            <RegistrationStats stats={stats} loading={statsLoading} />
            {/* Registrations Table (Class) */}
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
          <>
            {/* Registrations Table (Tutor) */}
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
          </>
        )}
      </div>
    </>
  );
};

export default RegistrationsPage;
