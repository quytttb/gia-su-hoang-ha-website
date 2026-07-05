import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { useToast } from '../../../hooks/useToast';

interface BulkActionsProps {
  selectedIds: string[];
  onApproveMultiple: (ids: string[]) => Promise<void>;
  onRejectMultiple: (ids: string[], reason: string) => Promise<void>;
  onClearSelection: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedIds,
  onApproveMultiple,
  onRejectMultiple,
  onClearSelection,
}) => {
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const handleApproveMultiple = async () => {
    try {
      setLoading(true);
      await onApproveMultiple(selectedIds);
      success('Thành công', `Đã duyệt ${selectedIds.length} đăng ký`);
      setShowApproveDialog(false);
      onClearSelection();
    } catch {
      error('Lỗi', 'Không thể duyệt đăng ký');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectMultiple = async () => {
    if (!rejectionReason.trim()) {
      error('Lỗi', 'Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      setLoading(true);
      await onRejectMultiple(selectedIds, rejectionReason);
      success('Thành công', `Đã từ chối ${selectedIds.length} đăng ký`);
      setShowRejectDialog(false);
      setRejectionReason('');
      onClearSelection();
    } catch {
      error('Lỗi', 'Không thể từ chối đăng ký');
    } finally {
      setLoading(false);
    }
  };

  if (selectedIds.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-card border rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              Đã chọn {selectedIds.length} đăng ký
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowApproveDialog(true)}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Duyệt tất cả
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRejectDialog(true)}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Từ chối tất cả
            </Button>
            <Button variant="outline" size="sm" onClick={onClearSelection}>
              <Trash2 className="h-4 w-4 mr-2" />
              Bỏ chọn
            </Button>
          </div>
        </div>
      </div>

      {/* Approve Multiple Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duyệt nhiều đăng ký</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn duyệt {selectedIds.length} đăng ký đã chọn không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleApproveMultiple} disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Duyệt tất cả'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Multiple Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối nhiều đăng ký</DialogTitle>
            <DialogDescription>
              Nhập lý do từ chối cho {selectedIds.length} đăng ký đã chọn
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <textarea
              placeholder="Nhập lý do từ chối..."
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm resize-none"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleRejectMultiple} disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Từ chối tất cả'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BulkActions;
