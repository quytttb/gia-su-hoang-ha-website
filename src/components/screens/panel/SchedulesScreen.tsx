import React, { useEffect, useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import PanelPageHeader from '@/components/panel/shared/PanelPageHeader';
import PanelTableSkeleton from '@/components/panel/shared/PanelTableSkeleton';
import DeleteConfirmDialog from '@/components/panel/shared/DeleteConfirmDialog';
import ScheduleTable from '@/components/panel/schedules/ScheduleTable';
import ScheduleForm from '@/components/panel/schedules/ScheduleForm';
import { createSchedule, updateSchedule, deleteSchedule } from '@/actions/schedule';
import { getAllClasses } from '@/data/classes';
import { getAllTutors } from '@/data/tutors';
import { Schedule } from '@/types';
import { formatDate } from '@/utils/helpers';
import { useSchedules } from '@/hooks/useSchedules';
import { queryKeys } from '@/lib/queryKeys';

const PAGE_SIZE = 10;

const SchedulesScreen: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: schedules = [], isLoading: loading, refetch } = useSchedules();
  const availableDates = useMemo(
    () => Array.from(new Set(schedules.map(s => s.startDate).filter(Boolean))).sort(),
    [schedules]
  );
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalSchedules, setTotalSchedules] = useState(0);

  // Search & Filter
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterDate, setFilterDate] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | undefined>(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(null);

  useEffect(() => {
    applyFilters(schedules, searchKeyword, filterDate, filterStatus);
  }, [schedules, searchKeyword, filterDate, filterStatus]);

  useEffect(() => {
    const handler = () => {
      void refetch();
    };
    window.addEventListener('panel-global-refresh', handler as EventListener);
    return () => window.removeEventListener('panel-global-refresh', handler as EventListener);
  }, [refetch]);

  const invalidateSchedules = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.schedules.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.schedules.dates });
    void refetch();
  };

  // Apply filters
  const applyFilters = (scheduleList: Schedule[], search: string, date: string, status: string) => {
    let filtered = [...scheduleList];

    // Filter by search
    if (search) {
      filtered = filtered.filter(
        schedule =>
          schedule.className.toLowerCase().includes(search.toLowerCase()) ||
          schedule.tutorName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by date
    if (date !== 'all') {
      filtered = filtered.filter(schedule => schedule.startDate === date);
    }

    // Filter by status (based on date - past, today, future)
    if (status !== 'all') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(schedule => {
        if (status === 'past') return schedule.startDate < today;
        if (status === 'today') return schedule.startDate === today;
        if (status === 'future') return schedule.startDate > today;
        return true;
      });
    }

    setFilteredSchedules(filtered);
    setTotalSchedules(filtered.length);
  };

  // Handle search
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setPage(1);
    applyFilters(schedules, keyword, filterDate, filterStatus);
  };

  // Handle filter change
  const handleFilterChange = ({ date, status }: { date?: string; status?: string }) => {
    const newDate = date !== undefined ? date : filterDate;
    const newStatus = status !== undefined ? status : filterStatus;

    setFilterDate(newDate);
    setFilterStatus(newStatus);
    setPage(1);

    applyFilters(schedules, searchKeyword, newDate, newStatus);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handle edit schedule
  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setIsFormOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (schedule: Schedule) => {
    setScheduleToDelete(schedule);
    setDeleteConfirmOpen(true);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!scheduleToDelete || !scheduleToDelete.id) {
      console.error('No schedule to delete or missing ID');
      return;
    }

    try {
      setActionLoading(true);
      const result = await deleteSchedule(scheduleToDelete.id);

      if (!result.success) {
        console.error('Error deleting schedule:', result.error);
        alert(`Không thể xóa lịch học: ${result.error ?? 'Lỗi không xác định'}`);
        return;
      }

      setDeleteConfirmOpen(false);
      setScheduleToDelete(null);
      invalidateSchedules();
    } catch (err) {
      console.error('Error deleting schedule:', err);
      alert('Không thể xóa lịch học. Vui lòng thử lại.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle save schedule (create/update)
  const handleSaveSchedule = async (scheduleData: {
    className: string;
    tutorName: string;
    startDate: string;
    startTime: string;
    endTime: string;
    maxStudents: number;
    status: Schedule['status'];
    studentPhones?: string[];
  }) => {
    try {
      setActionLoading(true);

      const [classes, tutors] = await Promise.all([getAllClasses(), getAllTutors()]);
      const matchedClass = classes.find(c => c.name === scheduleData.className);
      const matchedTutor = tutors.find(t => t.name === scheduleData.tutorName);

      if (!matchedClass) {
        throw new Error('Lớp học không tồn tại. Vui lòng chọn lớp học có trong hệ thống.');
      }
      if (!matchedTutor) {
        throw new Error('Giáo viên không tồn tại. Vui lòng chọn giáo viên có trong hệ thống.');
      }

      if (editingSchedule && editingSchedule.id) {
        const result = await updateSchedule(editingSchedule.id, {
          classId: matchedClass.id,
          tutorId: matchedTutor.id,
          startDate: scheduleData.startDate,
          startTime: scheduleData.startTime,
          endTime: scheduleData.endTime,
          maxStudents: scheduleData.maxStudents,
          studentPhones: scheduleData.studentPhones || [],
          status: scheduleData.status,
        });

        if (!result.success) {
          console.error('Error updating schedule:', result.error);
          throw new Error(result.error ?? 'Không thể cập nhật lịch học');
        }
      } else {
        const result = await createSchedule({
          classId: matchedClass.id,
          tutorId: matchedTutor.id,
          startDate: scheduleData.startDate,
          startTime: scheduleData.startTime,
          endTime: scheduleData.endTime,
          maxStudents: scheduleData.maxStudents,
          studentPhones: scheduleData.studentPhones || [],
          status: scheduleData.status,
        });

        if (!result.success) {
          console.error('Error creating schedule:', result.error);
          throw new Error(result.error ?? 'Không thể tạo lịch học');
        }
      }

      // Reload data
      invalidateSchedules();
      setIsFormOpen(false);
      setEditingSchedule(undefined);
    } catch (err) {
      console.error('Error saving schedule:', err);
      throw err; // Will be caught by the form
    } finally {
      setActionLoading(false);
    }
  };

  // Get paginated schedules
  const paginatedSchedules = filteredSchedules.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <PanelPageHeader
          title="Quản lý Lịch Học"
          description="Thêm, chỉnh sửa và quản lý lịch học của trung tâm."
          action={
            <Button
              onClick={() => {
                setEditingSchedule(undefined);
                setIsFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm lịch học
            </Button>
          }
        />

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm lịch học..."
                  value={searchKeyword}
                  onChange={e => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={filterDate}
                onValueChange={value => handleFilterChange({ date: value })}
              >
                <SelectTrigger>
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Chọn ngày" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả ngày</SelectItem>
                  {availableDates.map(date => (
                    <SelectItem key={date} value={date}>
                      {formatDate(date)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filterStatus}
                onValueChange={value => handleFilterChange({ status: value })}
              >
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="past">Đã qua</SelectItem>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="future">Sắp tới</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground flex items-center">
                Tổng: {totalSchedules} lịch học
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Table */}
        {loading ? (
          <PanelTableSkeleton />
        ) : (
          <Card>
            <ScheduleTable
              schedules={paginatedSchedules.map(schedule => ({
                id: schedule.id,
                name: schedule.className || `Lớp học ${schedule.classId}`,
                time: `${schedule.startTime} - ${schedule.endTime}`,
                teacher: schedule.tutorName,
                classroom: schedule.className || '',
                status: new Date(schedule.startDate) < new Date() ? 'inactive' : 'active',
                maxStudents: schedule.maxStudents,
                studentPhones: schedule.studentPhones,
              }))}
              onEdit={scheduleItem => {
                const originalSchedule = schedules.find(s => s.id === scheduleItem.id);
                if (originalSchedule) {
                  handleEditSchedule(originalSchedule);
                }
              }}
              onDelete={scheduleItem => {
                const originalSchedule = schedules.find(s => s.id === scheduleItem.id);
                if (originalSchedule) {
                  handleDeleteClick(originalSchedule);
                }
              }}
            />

            {totalSchedules > PAGE_SIZE && (
              <CardContent className="p-4 border-t flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Hiển thị {(page - 1) * PAGE_SIZE + 1} -{' '}
                  {Math.min(page * PAGE_SIZE, totalSchedules)} trong {totalSchedules} kết quả
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    Trước
                  </Button>
                  <span className="px-4 py-2 text-sm">
                    Trang {page} / {Math.ceil(totalSchedules / PAGE_SIZE)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= Math.ceil(totalSchedules / PAGE_SIZE)}
                  >
                    Sau
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Schedule Form Modal */}
        <ScheduleForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingSchedule(undefined);
          }}
          onSave={handleSaveSchedule}
          initialData={
            editingSchedule
              ? {
                  className: editingSchedule.className,
                  tutorName: editingSchedule.tutorName,
                  startDate: editingSchedule.startDate,
                  startTime: editingSchedule.startTime,
                  endTime: editingSchedule.endTime,
                  maxStudents: editingSchedule.maxStudents,
                  status: editingSchedule.status,
                  studentPhones: editingSchedule.studentPhones || [],
                }
              : undefined
          }
        />

        <DeleteConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          title="Xác nhận xóa lịch học"
          description={
            <>
              Bạn có chắc chắn muốn xóa lịch học &quot;{scheduleToDelete?.className} -{' '}
              {scheduleToDelete ? formatDate(scheduleToDelete.startDate) : ''}&quot;? Hành động này
              không thể hoàn tác.
            </>
          }
          onConfirm={handleDeleteConfirm}
          loading={actionLoading}
        />
      </div>
    </>
  );
};

export default SchedulesScreen;
