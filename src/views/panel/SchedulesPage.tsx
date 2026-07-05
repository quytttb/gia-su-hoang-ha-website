import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Loader2, Plus, Calendar, Filter, Search } from 'lucide-react';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import SkeletonLoading from '../../components/shared/SkeletonLoading';
import ScheduleTable from '../../components/panel/schedules/ScheduleTable';
import ScheduleForm from '../../components/panel/schedules/ScheduleForm';
import schedulesService from '../../services/firestore/schedulesService';
import { Schedule } from '../../types';
import { formatDate } from '../../utils/helpers';

const PAGE_SIZE = 10;

const SchedulesPage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalSchedules, setTotalSchedules] = useState(0);

  // Search & Filter
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterDate, setFilterDate] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | undefined>(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(null);

  // Load initial data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Load schedules
      const schedulesData = await schedulesService.getAll();
      setSchedules(schedulesData);
      setTotalSchedules(schedulesData.length);

      // Load available dates
      const dates = await schedulesService.getAvailableDates();
      setAvailableDates(dates);

      // Apply initial filtering
      applyFilters(schedulesData, searchKeyword, filterDate, filterStatus);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, [searchKeyword, filterDate, filterStatus]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Global refresh listener
  useEffect(() => {
    const handler = () => loadData();
    window.addEventListener('panel-global-refresh', handler as EventListener);
    return () => window.removeEventListener('panel-global-refresh', handler as EventListener);
  }, [loadData]);

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
      const result = await schedulesService.delete(scheduleToDelete.id);

      if (result.error) {
        console.error('Error deleting schedule:', result.error);
        alert(`Không thể xóa lịch học: ${result.error}`);
        return;
      }

      // Update local state
      const updatedSchedules = schedules.filter(s => s.id !== scheduleToDelete.id);
      setSchedules(updatedSchedules);
      applyFilters(updatedSchedules, searchKeyword, filterDate, filterStatus);

      setDeleteConfirmOpen(false);
      setScheduleToDelete(null);
    } catch (err) {
      console.error('Error deleting schedule:', err);
      alert('Không thể xóa lịch học. Vui lòng thử lại.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle save schedule (create/update)
  const handleSaveSchedule = async (scheduleData: any) => {
    try {
      setActionLoading(true);

      if (editingSchedule && editingSchedule.id) {
        // Update existing schedule
        const result = await schedulesService.update(editingSchedule.id, {
          classId: editingSchedule.classId || '', // Keep existing or empty
          className: scheduleData.className,
          tutorId: editingSchedule.tutorId || '', // Keep existing or empty
          tutorName: scheduleData.tutorName,
          startDate: scheduleData.startDate,
          startTime: scheduleData.startTime,
          endTime: scheduleData.endTime,
          maxStudents: scheduleData.maxStudents,
          studentPhones: scheduleData.studentPhones || [],
          status: scheduleData.status,
        });

        if (result.error) {
          console.error('Error updating schedule:', result.error);
          throw new Error(result.error);
        }
      } else {
        // Create new schedule
        const result = await schedulesService.create({
          classId: '', // Auto-generate or leave empty
          className: scheduleData.className,
          tutorId: '', // Auto-generate or leave empty
          tutorName: scheduleData.tutorName,
          startDate: scheduleData.startDate,
          startTime: scheduleData.startTime,
          endTime: scheduleData.endTime,
          maxStudents: scheduleData.maxStudents,
          studentPhones: scheduleData.studentPhones || [],
          status: scheduleData.status,
        });

        if (result.error) {
          console.error('Error creating schedule:', result.error);
          throw new Error(result.error);
        }
      }

      // Reload data
      await loadData();
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
        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Quản lý Lịch Học</h2>
              <p className="text-muted-foreground">
                Thêm, chỉnh sửa và quản lý lịch học của trung tâm.
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingSchedule(undefined);
                setIsFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm lịch học
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-card rounded-lg p-6 border">
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
            <Select value={filterDate} onValueChange={value => handleFilterChange({ date: value })}>
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
        </div>

        {/* Schedule Table */}
        {loading ? (
          <div className="bg-card rounded-lg p-6 border">
            <SkeletonLoading type="table-row" count={10} />
          </div>
        ) : (
          <div className="bg-card rounded-lg border">
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

            {/* Pagination */}
            {totalSchedules > PAGE_SIZE && (
              <div className="p-4 border-t flex justify-between items-center">
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
              </div>
            )}
          </div>
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

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa lịch học</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa lịch học "{scheduleToDelete?.className} -{' '}
                {scheduleToDelete ? formatDate(scheduleToDelete.startDate) : ''}"? Hành động này
                không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                className="text-foreground"
                onClick={() => setDeleteConfirmOpen(false)}
                disabled={actionLoading}
              >
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm} disabled={actionLoading}>
                {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Xóa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default SchedulesPage;
