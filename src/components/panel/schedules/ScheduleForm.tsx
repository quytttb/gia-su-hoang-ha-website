import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { CheckCircle, Loader2 } from 'lucide-react';
import schedulesService from '../../../services/firestore/schedulesService';
import { scheduleFormSchema } from '@/lib/validations/panel';
import { mapZodErrors } from '@/lib/validations/zodHelpers';

interface ScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: any;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    className: '',
    tutorName: '',
    startDate: '',
    startTime: '',
    endTime: '',
    maxStudents: 12,
    status: 'scheduled' as 'scheduled' | 'ongoing' | 'completed' | 'cancelled',
    studentPhones: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Existing options from schedules
  const [existingClassNames, setExistingClassNames] = useState<string[]>([]);
  const [existingTutorNames, setExistingTutorNames] = useState<string[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Load existing options when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadExistingOptions();
    }
  }, [isOpen]);

  const loadExistingOptions = async () => {
    try {
      setLoadingOptions(true);
      const schedules = await schedulesService.getAll();

      // Extract unique class names and tutor names
      const classNames = Array.from(
        new Set(schedules.map(s => s.className).filter(Boolean))
      ).sort();
      const tutorNames = Array.from(
        new Set(schedules.map(s => s.tutorName).filter(Boolean))
      ).sort();

      setExistingClassNames(classNames);
      setExistingTutorNames(tutorNames);
    } catch (error) {
      console.error('Error loading existing options:', error);
    } finally {
      setLoadingOptions(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        className: initialData.className || '',
        tutorName: initialData.tutorName || '',
        startDate: initialData.startDate || '',
        startTime: initialData.startTime || '',
        endTime: initialData.endTime || '',
        maxStudents: initialData.maxStudents || 12,
        status: initialData.status || 'scheduled',
        studentPhones: initialData.studentPhones || [],
      });
    } else {
      setFormData({
        className: '',
        tutorName: '',
        startDate: '',
        startTime: '',
        endTime: '',
        maxStudents: 12,
        status: 'scheduled',
        studentPhones: [],
      });
    }
    setErrors({});
    setSuccessMessage(null);
    setIsSubmitting(false);
  }, [initialData, isOpen]);

  const validateForm = () => {
    const result = scheduleFormSchema.safeParse(formData);
    if (!result.success) {
      const newErrors = mapZodErrors(result.error);
      if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
        newErrors.endTime = 'Giờ kết thúc phải sau giờ bắt đầu';
      }
      if (formData.startDate) {
        const selectedDate = new Date(formData.startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) newErrors.startDate = 'Không thể chọn ngày trong quá khứ';
      }
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleChange = (field: string, value: string) => {
    // Ignore disabled placeholder values
    if (value === 'loading' || value === 'no-classes' || value === 'no-tutors') {
      return;
    }

    if (field === 'maxStudents') {
      setFormData(prev => ({ ...prev, [field]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    if (successMessage) setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage(null);
    try {
      await onSave(formData);
      setSuccessMessage('Đã lưu lịch học!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (error: any) {
      setErrors(prev => ({ ...prev, general: error.message || 'Có lỗi khi lưu lịch học' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {initialData ? 'Chỉnh sửa lịch học' : 'Thêm lịch học mới'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {initialData ? 'Cập nhật thông tin lịch học' : 'Điền thông tin để tạo lịch học mới'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="className" className="text-sm font-medium text-foreground">
                Tên lớp học <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.className}
                onValueChange={value => handleChange('className', value)}
              >
                <SelectTrigger className={errors.className ? 'border-destructive' : ''}>
                  <SelectValue
                    placeholder={loadingOptions ? 'Đang tải...' : 'Chọn hoặc nhập tên lớp học'}
                  />
                </SelectTrigger>
                <SelectContent>
                  {loadingOptions ? (
                    <SelectItem value="loading" disabled>
                      Đang tải...
                    </SelectItem>
                  ) : (
                    <>
                      {existingClassNames.map(className => (
                        <SelectItem key={className} value={className}>
                          {className}
                        </SelectItem>
                      ))}
                      {existingClassNames.length === 0 && (
                        <SelectItem value="no-classes" disabled>
                          Chưa có lớp học nào
                        </SelectItem>
                      )}
                    </>
                  )}
                </SelectContent>
              </Select>
              <Input
                placeholder="Hoặc nhập tên lớp học mới..."
                value={formData.className}
                onChange={e => handleChange('className', e.target.value)}
                className="mt-2"
              />
              {errors.className && (
                <p className="text-xs text-destructive mt-1">{errors.className}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tutorName" className="text-sm font-medium text-foreground">
                Tên giáo viên <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.tutorName}
                onValueChange={value => handleChange('tutorName', value)}
              >
                <SelectTrigger className={errors.tutorName ? 'border-destructive' : ''}>
                  <SelectValue
                    placeholder={loadingOptions ? 'Đang tải...' : 'Chọn hoặc nhập tên giáo viên'}
                  />
                </SelectTrigger>
                <SelectContent>
                  {loadingOptions ? (
                    <SelectItem value="loading" disabled>
                      Đang tải...
                    </SelectItem>
                  ) : (
                    <>
                      {existingTutorNames.map(tutorName => (
                        <SelectItem key={tutorName} value={tutorName}>
                          {tutorName}
                        </SelectItem>
                      ))}
                      {existingTutorNames.length === 0 && (
                        <SelectItem value="no-tutors" disabled>
                          Chưa có giáo viên nào
                        </SelectItem>
                      )}
                    </>
                  )}
                </SelectContent>
              </Select>
              <Input
                placeholder="Hoặc nhập tên giáo viên mới..."
                value={formData.tutorName}
                onChange={e => handleChange('tutorName', e.target.value)}
                className="mt-2"
              />
              {errors.tutorName && (
                <p className="text-xs text-destructive mt-1">{errors.tutorName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-sm font-medium text-foreground">
              Ngày khai giảng <span className="text-destructive">*</span>
            </Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={e => handleChange('startDate', e.target.value)}
              className={errors.startDate ? 'border-destructive' : ''}
            />
            {errors.startDate && (
              <p className="text-xs text-destructive mt-1">{errors.startDate}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-sm font-medium text-foreground">
                Giờ bắt đầu <span className="text-destructive">*</span>
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={e => handleChange('startTime', e.target.value)}
                className={errors.startTime ? 'border-destructive' : ''}
              />
              {errors.startTime && (
                <p className="text-xs text-destructive mt-1">{errors.startTime}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-sm font-medium text-foreground">
                Giờ kết thúc <span className="text-destructive">*</span>
              </Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={e => handleChange('endTime', e.target.value)}
                className={errors.endTime ? 'border-destructive' : ''}
              />
              {errors.endTime && <p className="text-xs text-destructive mt-1">{errors.endTime}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">Số học viên tối đa</Label>
            <div className="p-3 bg-gray-50 border rounded-lg">
              <span className="text-sm font-medium text-gray-700">12 học viên</span>
              <p className="text-xs text-gray-500 mt-1">Số học viên tối đa được cố định</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium text-foreground">
              Trạng thái
            </Label>
            <Select value={formData.status} onValueChange={value => handleChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                <SelectItem value="ongoing">Đang diễn ra</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {successMessage && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">{successMessage}</span>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-muted-foreground hover:text-foreground"
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                'Lưu'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleForm;
