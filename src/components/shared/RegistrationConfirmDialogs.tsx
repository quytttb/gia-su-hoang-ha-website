import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export type RegistrationDialogVariant = 'class' | 'tutor';

const PRESETS = {
  class: {
    confirmTitle: 'Xác nhận đăng ký lớp học',
    confirmDescription: (name: string) =>
      `Bạn có chắc chắn muốn đăng ký lớp học "${name}" với thông tin đã nhập không?`,
    confirmButton: 'Xác nhận đăng ký',
    successTitle: '🎉 Đăng ký thành công!',
    successDescription: (
      <>
        Cảm ơn bạn đã đăng ký lớp học với Gia Sư Hoàng Hà.
        <br />
        Nhân viên tư vấn sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận thông tin.
      </>
    ),
    backButton: 'Quay lại trang lớp học',
  },
  tutor: {
    confirmTitle: 'Xác nhận yêu cầu tìm Gia sư',
    confirmDescription: (name: string) =>
      `Bạn có chắc chắn muốn gửi yêu cầu tìm "${name}" với thông tin đã nhập không?`,
    confirmButton: 'Xác nhận gửi yêu cầu',
    successTitle: '🎉 Gửi yêu cầu thành công!',
    successDescription: (
      <>
        Cảm ơn bạn đã sử dụng dịch vụ tìm Gia sư của Gia Sư Hoàng Hà.
        <br />
        Nhân viên tư vấn sẽ liên hệ với bạn trong thời gian sớm nhất để tìm Gia sư phù hợp.
      </>
    ),
    backButton: 'Quay lại trang tìm Gia sư',
  },
} as const;

interface RegistrationConfirmDialogsProps {
  variant: RegistrationDialogVariant;
  entityName: string;
  showConfirmDialog: boolean;
  showSuccessDialog: boolean;
  submitting: boolean;
  onConfirmOpenChange: (open: boolean) => void;
  onSuccessOpenChange: (open: boolean) => void;
  onConfirmSubmit: () => void;
  onTriggerConfetti: () => void;
  onNavigateBack: () => void;
}

const RegistrationConfirmDialogs = ({
  variant,
  entityName,
  showConfirmDialog,
  showSuccessDialog,
  submitting,
  onConfirmOpenChange,
  onSuccessOpenChange,
  onConfirmSubmit,
  onTriggerConfetti,
  onNavigateBack,
}: RegistrationConfirmDialogsProps) => {
  const preset = PRESETS[variant];

  return (
    <>
      <Dialog open={showConfirmDialog} onOpenChange={onConfirmOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{preset.confirmTitle}</DialogTitle>
            <DialogDescription>{preset.confirmDescription(entityName)}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => onConfirmOpenChange(false)}>
              Hủy
            </Button>
            <Button onClick={onConfirmSubmit} disabled={submitting}>
              {submitting ? 'Đang xử lý...' : preset.confirmButton}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessDialog} onOpenChange={onSuccessOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-green-600">{preset.successTitle}</DialogTitle>
            <DialogDescription className="text-center">
              {preset.successDescription}
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
              {preset.backButton}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RegistrationConfirmDialogs;
