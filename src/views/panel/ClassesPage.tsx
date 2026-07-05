import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import classesService from '../../services/firestore/classesService';
import { Class } from '../../types';
import { FirestoreClass } from '../../types/firestore';
import { extractClassCategories, convertFirestoreClass } from '../../utils/classHelpers';
import ClassTable from '../../components/panel/classes/ClassTable';
import ClassForm from '../../components/panel/classes/ClassForm';
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
import { PartialWithFieldValue } from 'firebase/firestore';
import SkeletonLoading from '../../components/shared/SkeletonLoading';

const PAGE_SIZE = 10;

const ClassesPage: React.FC = () => {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [totalClasses, setTotalClasses] = useState(0);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);

  // Search & Filter
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | undefined>(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Load classes from Firebase
  const loadClasses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await classesService.getAll();
      const data = res.data.map(convertFirestoreClass);

      setClasses(data);
      setTotalClasses(data.length);

      // Extract unique categories
      const cats = extractClassCategories();
      setCategories(cats);

      // Apply initial filtering
      applyFilters(data, searchKeyword, filterCategory, filterStatus);
    } catch (err) {
      console.error('Error loading classes:', err);
    } finally {
      setLoading(false);
    }
  }, [searchKeyword, filterCategory, filterStatus]);

  // Load classes on mount
  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  // Global refresh listener
  useEffect(() => {
    const handler = () => loadClasses();
    window.addEventListener('panel-global-refresh', handler as EventListener);
    return () => window.removeEventListener('panel-global-refresh', handler as EventListener);
  }, [loadClasses]);

  // Apply filters
  const applyFilters = (classList: Class[], search: string, category: string, status: string) => {
    let filtered = [...classList];

    // Filter by search
    if (search) {
      filtered = filtered.filter(classItem =>
        classItem.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(classItem => classItem.category === category);
    }

    // Filter by status
    if (status !== 'all') {
      filtered = filtered.filter(classItem => {
        if (status === 'active') return classItem.isActive !== false;
        return classItem.isActive === false;
      });
    }

    setFilteredClasses(filtered);
    setTotalClasses(filtered.length);
  };

  // Handle search
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setPage(1);
    applyFilters(classes, keyword, filterCategory, filterStatus);
  };

  // Handle filter change
  const handleFilterChange = ({ category, status }: { category?: string; status?: string }) => {
    const newCategory = category !== undefined ? category : filterCategory;
    const newStatus = status !== undefined ? status : filterStatus;

    setFilterCategory(newCategory);
    setFilterStatus(newStatus);
    setPage(1);

    applyFilters(classes, searchKeyword, newCategory, newStatus);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handle edit class
  const handleEditClass = (classItem: Class) => {
    setEditingClass(classItem);
    setIsFormOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (classItem: Class) => {
    setClassToDelete(classItem);
    setDeleteConfirmOpen(true);
  };

  const handleViewRegistrations = (classItem: Class) => {
    router.push(`/panel/registrations?classId=${classItem.id}`);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!classToDelete || !classToDelete.id) {
      console.error('No class to delete or missing ID');
      return;
    }

    try {
      setActionLoading(true);
      const result = await classesService.delete(classToDelete.id);

      if (result.error) {
        console.error('Error deleting class:', result.error);
        alert(`Không thể xóa lớp học: ${result.error}`);
        return;
      }

      // Update local state
      setClasses(prev => prev.filter(c => c.id !== classToDelete.id));
      setFilteredClasses(prev => prev.filter(c => c.id !== classToDelete.id));
      setTotalClasses(prev => prev - 1);

      setDeleteConfirmOpen(false);
      setClassToDelete(null);
    } catch (err) {
      console.error('Error deleting class:', err);
      alert('Không thể xóa lớp học. Vui lòng thử lại.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle save class (create/update)
  const handleSaveClass = async (classData: Partial<Class>) => {
    try {
      setActionLoading(true);

      if (editingClass && editingClass.id) {
        // Update existing class
        const result = await classesService.update(
          editingClass.id,
          classData as unknown as PartialWithFieldValue<Omit<FirestoreClass, 'id' | 'createdAt'>>
        );

        if (result.error) {
          console.error('Error updating class:', result.error);
          throw new Error(result.error);
        }

        if (result.data) {
          const convertedClass = convertFirestoreClass(result.data);
          setClasses(prev => prev.map(c => (c.id === convertedClass.id ? convertedClass : c)));
          setFilteredClasses(prev =>
            prev.map(c => (c.id === convertedClass.id ? convertedClass : c))
          );
        }
      } else {
        // Create new class
        const result = await classesService.create(
          classData as unknown as Omit<FirestoreClass, 'id' | 'createdAt' | 'updatedAt'>
        );

        if (result.error) {
          console.error('Error creating class:', result.error);
          throw new Error(result.error);
        }

        if (result.data) {
          const convertedClass = convertFirestoreClass(result.data);
          setClasses(prev => [...prev, convertedClass]);
          // Re-apply filters
          applyFilters([...classes, convertedClass], searchKeyword, filterCategory, filterStatus);
        }
      }

      setIsFormOpen(false);
      setEditingClass(undefined);
    } catch (err) {
      console.error('Error saving class:', err);
      throw err; // Will be caught by the form
    } finally {
      setActionLoading(false);
    }
  };

  // Get paginated classes
  const paginatedClasses = filteredClasses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-card rounded-lg p-6 border flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Quản lý Lớp học</h2>
            <p className="text-muted-foreground">
              Thêm, chỉnh sửa và quản lý các lớp học của trung tâm.
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingClass(undefined);
              setIsFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm lớp học
          </Button>
        </div>

        {/* Class Table */}
        {loading ? (
          <div className="bg-card rounded-lg p-6 border">
            <SkeletonLoading type="table-row" count={10} />
          </div>
        ) : (
          <ClassTable
            classes={paginatedClasses}
            page={page}
            pageSize={PAGE_SIZE}
            total={totalClasses}
            onEdit={handleEditClass}
            onDelete={handleDeleteClick}
            onViewRegistrations={handleViewRegistrations}
            onPageChange={handlePageChange}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            categories={categories}
          />
        )}

        {/* Class Form Modal */}
        <ClassForm
          class={editingClass}
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingClass(undefined);
          }}
          onSave={handleSaveClass}
          categories={categories}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa lớp học</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa lớp học "{classToDelete?.name}"? Hành động này không thể
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

export default ClassesPage;
