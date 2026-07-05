import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';

interface TutorRegistrationDialogsProps {
  tutorName: string;
  showConfirmDialog: boolean;
  showSuccessDialog: boolean;
  submitting: boolean;
  onConfirmOpenChange: (open: boolean) => void;
  onSuccessOpenChange: (open: boolean) => void;
  onConfirmSubmit: () => void;
  onTriggerConfetti: () => void;
  onNavigateBack: () => void;
}

const TutorRegistrationDialogs = ({
  tutorName,
  showConfirmDialog,
  showSuccessDialog,
  submitting,
  onConfirmOpenChange,
  onSuccessOpenChange,
  onConfirmSubmit,
  onTriggerConfetti,
  onNavigateBack,
}: TutorRegistrationDialogsProps) => (
  <>
    <Dialog open={showConfirmDialog} onOpenChange={onConfirmOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận yêu cầu tìm Gia sư</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn gửi yêu cầu tìm &quot;{tutorName}&quot; với thông tin đã nhập
            không?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onConfirmOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={onConfirmSubmit} disabled={submitting}>
            {submitting ? 'Đang xử lý...' : 'Xác nhận gửi yêu cầu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog open={showSuccessDialog} onOpenChange={onSuccessOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-green-600">
            🎉 Gửi yêu cầu thành công!
          </DialogTitle>
          <DialogDescription className="text-center">
            Cảm ơn bạn đã sử dụng dịch vụ tìm Gia sư của Gia Sư Hoàng Hà.
            <br />
            Nhân viên tư vấn sẽ liên hệ với bạn trong thời gian sớm nhất để tìm Gia sư phù hợp.
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
            Quay lại trang tìm Gia sư
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
);

export default TutorRegistrationDialogs;
