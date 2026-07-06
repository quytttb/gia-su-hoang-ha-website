import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createTutor, updateTutor, deleteTutor } from '@/actions/tutor';
import { Tutor } from '../../types';
import { TutorTable, TutorForm } from '../../components/panel/tutors';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';
import PanelPageHeader from '@/components/panel/shared/PanelPageHeader';
import PanelTableSkeleton from '@/components/panel/shared/PanelTableSkeleton';
import DeleteConfirmDialog from '@/components/panel/shared/DeleteConfirmDialog';
import { useTutors } from '@/hooks/useTutors';
import { queryKeys } from '@/lib/queryKeys';

const PAGE_SIZE = 10;

const TutorsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: tutors = [], isLoading: loading, refetch } = useTutors();
  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>([]);
  const [totalTutors, setTotalTutors] = useState(0);
  const [page, setPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTutor, setEditingTutor] = useState<Tutor | undefined>(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [tutorToDelete, setTutorToDelete] = useState<Tutor | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    applyFilters(tutors, searchKeyword);
  }, [tutors, searchKeyword]);

  useEffect(() => {
    const handler = () => {
      void refetch();
    };
    window.addEventListener('panel-global-refresh', handler as EventListener);
    return () => window.removeEventListener('panel-global-refresh', handler as EventListener);
  }, [refetch]);

  const invalidateTutors = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.tutors.list(false) });
    void refetch();
  };

  const applyFilters = (tutorList: Tutor[], search: string) => {
    let filtered = [...tutorList];
    if (search) {
      filtered = filtered.filter(tutor => tutor.name.toLowerCase().includes(search.toLowerCase()));
    }
    setFilteredTutors(filtered);
    setTotalTutors(filtered.length);
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setPage(1);
    applyFilters(tutors, keyword);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleEditTutor = (tutor: Tutor) => {
    setEditingTutor(tutor);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (tutor: Tutor) => {
    setTutorToDelete(tutor);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!tutorToDelete) return;
    try {
      setActionLoading(true);
      const result = await deleteTutor(tutorToDelete.id);
      if (!result.success) {
        alert(`Không thể xóa giáo viên: ${result.error ?? 'Lỗi không xác định'}`);
        return;
      }
      setDeleteConfirmOpen(false);
      setTutorToDelete(null);
      invalidateTutors();
    } catch (err) {
      console.error('Error deleting tutor:', err);
      alert('Không thể xóa giáo viên. Vui lòng thử lại.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveTutor = async (tutorData: Omit<Tutor, 'id'>) => {
    try {
      setActionLoading(true);
      if (editingTutor) {
        const result = await updateTutor(editingTutor.id, tutorData);
        if (!result.success) {
          throw new Error(result.error ?? 'Không thể cập nhật giáo viên');
        }
      } else {
        const result = await createTutor({
          ...tutorData,
          isActive: true,
          experience: '',
          education: '',
          subjects: [],
          availability: [],
        });
        if (!result.success) {
          throw new Error(result.error ?? 'Không thể tạo giáo viên');
        }
      }
      invalidateTutors();
      setIsFormOpen(false);
      setEditingTutor(undefined);
    } catch (err) {
      console.error('Error saving tutor:', err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const paginatedTutors = filteredTutors.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <PanelPageHeader
          title="Quản lý Giáo viên"
          description="Thêm, chỉnh sửa và quản lý đội ngũ giáo viên của trung tâm."
          action={
            <Button
              onClick={() => {
                setEditingTutor(undefined);
                setIsFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm giáo viên
            </Button>
          }
        />
        {loading ? (
          <PanelTableSkeleton />
        ) : (
          <TutorTable
            tutors={paginatedTutors}
            page={page}
            pageSize={PAGE_SIZE}
            total={totalTutors}
            onEdit={handleEditTutor}
            onDelete={handleDeleteClick}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
          />
        )}
        {/* Tutor Form Modal */}
        <TutorForm
          tutor={editingTutor}
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTutor(undefined);
          }}
          onSave={handleSaveTutor}
        />
        <DeleteConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          title="Xác nhận xóa giáo viên"
          description={
            <>
              Bạn có chắc chắn muốn xóa giáo viên &quot;{tutorToDelete?.name}&quot;? Hành động này
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

export default TutorsPage;
