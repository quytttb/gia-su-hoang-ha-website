import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import classesService from '../../services/firestore/classesService';
import { Class } from '../../types';
import { FirestoreClass } from '../../types/firestore';
import { extractClassCategories, convertFirestoreClass } from '../../utils/classHelpers';
import ClassTable from '../../components/panel/classes/ClassTable';
import ClassForm from '../../components/panel/classes/ClassForm';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';
import { PartialWithFieldValue } from 'firebase/firestore';
import PanelPageHeader from '@/components/panel/shared/PanelPageHeader';
import PanelTableSkeleton from '@/components/panel/shared/PanelTableSkeleton';
import DeleteConfirmDialog from '@/components/panel/shared/DeleteConfirmDialog';
import { useAdminClasses } from '@/hooks/useClasses';
import { queryKeys } from '@/lib/queryKeys';

const PAGE_SIZE = 10;

const ClassesPage: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: rawClasses, isLoading: loading, refetch } = useAdminClasses();
  const classes = useMemo(() => (rawClasses ?? []).map(convertFirestoreClass), [rawClasses]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [totalClasses, setTotalClasses] = useState(0);

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

  // Apply filters when classes or filter state changes
  useEffect(() => {
    if (classes.length === 0) {
      setFilteredClasses([]);
      setTotalClasses(0);
      return;
    }
    const cats = extractClassCategories();
    setCategories(cats);
    applyFilters(classes, searchKeyword, filterCategory, filterStatus);
  }, [classes, searchKeyword, filterCategory, filterStatus]);

  // Global refresh listener
  useEffect(() => {
    const handler = () => {
      void refetch();
    };
    window.addEventListener('panel-global-refresh', handler as EventListener);
    return () => window.removeEventListener('panel-global-refresh', handler as EventListener);
  }, [refetch]);

  const invalidateClasses = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.classes.all });
    void refetch();
  };

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

      setDeleteConfirmOpen(false);
      setClassToDelete(null);
      invalidateClasses();
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
          invalidateClasses();
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
          invalidateClasses();
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
        <PanelPageHeader
          title="Quản lý Lớp học"
          description="Thêm, chỉnh sửa và quản lý các lớp học của trung tâm."
          action={
            <Button
              onClick={() => {
                setEditingClass(undefined);
                setIsFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm lớp học
            </Button>
          }
        />

        {loading ? (
          <PanelTableSkeleton />
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

        <DeleteConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          title="Xác nhận xóa lớp học"
          description={
            <>
              Bạn có chắc chắn muốn xóa lớp học &quot;{classToDelete?.name}&quot;? Hành động này
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

export default ClassesPage;
