import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ClassRegistrationDialogsProps {
  courseName: string;
  showConfirmDialog: boolean;
  showSuccessDialog: boolean;
  submitting: boolean;
  onConfirmOpenChange: (open: boolean) => void;
  onSuccessOpenChange: (open: boolean) => void;
  onConfirmSubmit: () => void;
  onTriggerConfetti: () => void;
  onNavigateBack: () => void;
}

const ClassRegistrationDialogs = ({
  courseName,
  showConfirmDialog,
  showSuccessDialog,
  submitting,
  onConfirmOpenChange,
  onSuccessOpenChange,
  onConfirmSubmit,
  onTriggerConfetti,
  onNavigateBack,
}: ClassRegistrationDialogsProps) => (
  <>
    <Dialog open={showConfirmDialog} onOpenChange={onConfirmOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận đăng ký lớp học</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn đăng ký lớp học &quot;{courseName}&quot; với thông tin đã nhập
            không?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onConfirmOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={onConfirmSubmit} disabled={submitting}>
            {submitting ? 'Đang xử lý...' : 'Xác nhận đăng ký'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog open={showSuccessDialog} onOpenChange={onSuccessOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-green-600">🎉 Đăng ký thành công!</DialogTitle>
          <DialogDescription className="text-center">
            Cảm ơn bạn đã đăng ký lớp học với Gia Sư Hoàng Hà.
            <br />
            Nhân viên tư vấn sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận thông tin.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center space-x-2">
          <Button variant="outline" onClick={onTriggerConfetti}>
            🎊 Pháo hoa
          </Button>
          <Button
            onClick={() => {
              onSuccessOpenChange(false);
              onNavigateBack();
            }}
          >
            Quay lại trang lớp học
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
);

export default ClassRegistrationDialogs;
