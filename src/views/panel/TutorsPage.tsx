import React, { useEffect, useState, useCallback } from 'react';
import tutorsService from '../../services/firestore/tutorsService';
import { Tutor } from '../../types';
import { TutorTable, TutorForm } from '../../components/panel/tutors';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Loader2, Plus } from 'lucide-react';
import SkeletonLoading from '../../components/shared/SkeletonLoading';

const PAGE_SIZE = 10;

const TutorsPage: React.FC = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>([]);
  const [totalTutors, setTotalTutors] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTutor, setEditingTutor] = useState<Tutor | undefined>(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [tutorToDelete, setTutorToDelete] = useState<Tutor | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadTutors = useCallback(async () => {
    setLoading(true);
    try {
      const data = await tutorsService.getAllTutors();
      setTutors(data);
      setTotalTutors(data.length);
      applyFilters(data, searchKeyword);
    } catch (err) {
      console.error('Error loading tutors:', err);
    } finally {
      setLoading(false);
    }
  }, [searchKeyword]);

  useEffect(() => {
    loadTutors();
  }, [loadTutors]);

  // Global refresh listener
  useEffect(() => {
    const handler = () => loadTutors();
    window.addEventListener('panel-global-refresh', handler as EventListener);
    return () => window.removeEventListener('panel-global-refresh', handler as EventListener);
  }, [loadTutors]);

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
      await tutorsService.deleteTutor(tutorToDelete.id);
      setTutors(prev => prev.filter(t => t.id !== tutorToDelete.id));
      setFilteredTutors(prev => prev.filter(t => t.id !== tutorToDelete.id));
      setTotalTutors(prev => prev - 1);
      setDeleteConfirmOpen(false);
      setTutorToDelete(null);
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
        // Update
        await tutorsService.updateTutor(editingTutor.id, tutorData);
        setTutors(prev => prev.map(t => (t.id === editingTutor.id ? { ...t, ...tutorData } : t)));
        setFilteredTutors(prev =>
          prev.map(t => (t.id === editingTutor.id ? { ...t, ...tutorData } : t))
        );
      } else {
        // Create
        const newId = await tutorsService.addTutor({
          ...tutorData,
          isActive: true,
          experience: '',
          education: '',
          subjects: [],
          availability: [],
        });
        if (newId) {
          setTutors(prev => [...prev, { ...tutorData, id: newId }]);
          applyFilters([...tutors, { ...tutorData, id: newId }], searchKeyword);
        }
      }
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
        <div className="bg-card rounded-lg p-6 border flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Quản lý Giáo viên</h2>
            <p className="text-muted-foreground">
              Thêm, chỉnh sửa và quản lý đội ngũ giáo viên của trung tâm.
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingTutor(undefined);
              setIsFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm giáo viên
          </Button>
        </div>
        {/* Tutor Table */}
        {loading ? (
          <div className="bg-card rounded-lg p-6 border">
            <SkeletonLoading type="table-row" count={10} />
          </div>
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
        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa giáo viên</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa giáo viên "{tutorToDelete?.name}"? Hành động này không thể
                hoàn tác.
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

export default TutorsPage;
