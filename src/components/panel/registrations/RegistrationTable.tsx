import React, { useState } from 'react';
import { Registration } from '../../../types';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Eye, CheckCircle, XCircle, Phone, User, Book, Calendar } from 'lucide-react';
import { formatDate } from '../../../utils/helpers';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Textarea } from '../../../components/ui/textarea';
import { useToast } from '../../../hooks/useToast';
import RegistrationDetail from './RegistrationDetail';
import BulkActions from './BulkActions';

interface RegistrationTableProps {
  registrations: Registration[];
  loading: boolean;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
  onApproveMultiple?: (ids: string[]) => Promise<void>;
  onRejectMultiple?: (ids: string[], reason: string) => Promise<void>;
  onRefresh: () => void;
  /** Explicit flag for tutor tab, ensures correct column when empty */
  isTutorTab?: boolean;
}

const statusConfig = {
  pending: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800' },
  approved: { label: 'Đã duyệt', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Đã từ chối', color: 'bg-red-100 text-red-800' },
  cancelled: { label: 'Đã hủy', color: 'bg-gray-100 text-gray-800' },
  completed: { label: 'Hoàn thành', color: 'bg-blue-100 text-blue-800' },
  matched: { label: 'Đã ghép lớp', color: 'bg-purple-100 text-purple-800' },
  trial_scheduled: { label: 'Đã xếp lịch học thử', color: 'bg-indigo-100 text-indigo-800' },
};

const RegistrationTable: React.FC<RegistrationTableProps> = ({
  registrations,
  loading,
  onApprove,
  onReject,
  onApproveMultiple,
  onRejectMultiple,
  onRefresh,
  isTutorTab: propIsTutorTab,
}) => {
  // Use explicit prop to detect tutor tab view
  const showTutorTab = Boolean(propIsTutorTab);

  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { success, error: showError } = useToast();

  // Filter registrations
  const filteredRegistrations = registrations.filter(registration => {
    const matchesStatus = filterStatus === 'all' || registration.status === filterStatus;
    const matchesSearch =
      searchTerm === '' ||
      registration.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.studentPhone.includes(searchTerm) ||
      registration.parentPhone.includes(searchTerm);

    return matchesStatus && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRegistrations = filteredRegistrations.slice(startIndex, startIndex + itemsPerPage);

  const handleApprove = async (registration: Registration) => {
    try {
      await onApprove(registration.id);
      success('Thành công', 'Đã duyệt đăng ký thành công');
      onRefresh();
    } catch {
      showError('Lỗi', 'Không thể duyệt đăng ký');
    }
  };

  const handleReject = async () => {
    if (!selectedRegistration || !rejectionReason.trim()) return;

    try {
      await onReject(selectedRegistration.id, rejectionReason);
      success('Thành công', 'Đã từ chối đăng ký');
      setShowRejectDialog(false);
      setRejectionReason('');
      setSelectedRegistration(null);
      onRefresh();
    } catch {
      showError('Lỗi', 'Không thể từ chối đăng ký');
    }
  };

  const openRejectDialog = (registration: Registration) => {
    setSelectedRegistration(registration);
    setShowRejectDialog(true);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const selectableIds = paginatedRegistrations
        .filter(reg => reg.status === 'pending')
        .map(reg => reg.id);
      setSelectedIds(selectableIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  const isAllSelected =
    paginatedRegistrations.filter(reg => reg.status === 'pending').length > 0 &&
    paginatedRegistrations
      .filter(reg => reg.status === 'pending')
      .every(reg => selectedIds.includes(reg.id));

  const handleApproveMultiple = async (ids: string[]) => {
    if (onApproveMultiple) {
      await onApproveMultiple(ids);
    }
  };

  const handleRejectMultiple = async (ids: string[], reason: string) => {
    if (onRejectMultiple) {
      await onRejectMultiple(ids, reason);
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg border">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Bulk Actions */}
      {(onApproveMultiple || onRejectMultiple) && (
        <BulkActions
          selectedIds={selectedIds}
          onApproveMultiple={handleApproveMultiple}
          onRejectMultiple={handleRejectMultiple}
          onClearSelection={() => setSelectedIds([])}
        />
      )}

      <div className="bg-card rounded-lg border">
        {/* Header with filters */}
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Danh sách đăng ký</h3>
              <p className="text-sm text-muted-foreground">
                Tổng cộng {filteredRegistrations.length} đăng ký
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Input
                placeholder="Tìm kiếm theo tên, SĐT..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm text-foreground"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Đã từ chối</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                {(onApproveMultiple || onRejectMultiple) && (
                  <th className="text-left p-4 font-medium text-foreground w-12">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={e => handleSelectAll(e.target.checked)}
                      className="rounded border-input"
                    />
                  </th>
                )}
                <th className="text-left p-4 font-medium text-foreground">Học viên</th>
                <th className="text-left p-4 font-medium text-foreground">Phụ huynh</th>
                {/* Dynamic column header */}
                <th className="text-left p-4 font-medium text-foreground">
                  {showTutorTab ? 'Gia sư' : 'Lớp học'}
                </th>
                <th className="text-left p-4 font-medium text-foreground">Ngày đăng ký</th>
                <th className="text-left p-4 font-medium text-foreground">Trạng thái</th>
                <th className="text-left p-4 font-medium text-foreground">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRegistrations.length === 0 ? (
                <tr>
                  <td
                    colSpan={onApproveMultiple || onRejectMultiple ? 7 : 6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Không có đăng ký nào
                  </td>
                </tr>
              ) : (
                paginatedRegistrations.map(registration => (
                  <tr key={registration.id} className="border-b hover:bg-muted/50">
                    {(onApproveMultiple || onRejectMultiple) && (
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(registration.id)}
                          onChange={e => handleSelectOne(registration.id, e.target.checked)}
                          className="rounded border-input"
                        />
                      </td>
                    )}
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">
                            {registration.studentName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {registration.studentPhone}
                          </span>
                        </div>
                        {registration.studentSchool && (
                          <div className="flex items-center gap-2">
                            <Book className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {registration.studentSchool}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">
                            {registration.parentName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {registration.parentPhone}
                          </span>
                        </div>
                      </div>
                    </td>
                    {/* Dynamic column: Gia sư or Lớp học */}
                    {showTutorTab ? (
                      <td className="p-4">
                        <span className="text-foreground">
                          {registration.tutorType === 'teacher' ? 'Giáo viên' : 'Sinh viên'}
                        </span>
                      </td>
                    ) : (
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Book className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{registration.className || 'N/A'}</span>
                        </div>
                      </td>
                    )}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">
                          {formatDate(registration.registrationDate)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={statusConfig[registration.status]?.color}>
                        {statusConfig[registration.status]?.label}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRegistration(registration)}
                        >
                          <Eye className="h-4 w-4 text-foreground" />
                        </Button>
                        {registration.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApprove(registration)}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openRejectDialog(registration)}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Hiển thị {startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, filteredRegistrations.length)} của{' '}
              {filteredRegistrations.length}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Trước
              </Button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Registration Detail Dialog */}
      <Dialog open={!!selectedRegistration} onOpenChange={() => setSelectedRegistration(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết đăng ký</DialogTitle>
            <DialogDescription>Thông tin chi tiết về đăng ký học viên</DialogDescription>
          </DialogHeader>
          {selectedRegistration && <RegistrationDetail registration={selectedRegistration} />}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối đăng ký</DialogTitle>
            <DialogDescription>Vui lòng nhập lý do từ chối đăng ký này</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Nhập lý do từ chối..."
              value={rejectionReason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setRejectionReason(e.target.value)
              }
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RegistrationTable;
