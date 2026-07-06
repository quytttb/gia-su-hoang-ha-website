import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Loader2 } from 'lucide-react';
import { getAllSchedules } from '@/data/schedules';
import { scheduleFormSchema, type ScheduleFormValues } from '@/lib/validations/panel';

interface ScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ScheduleFormValues) => Promise<void>;
  initialData?: Partial<ScheduleFormValues>;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [existingClassNames, setExistingClassNames] = useState<string[]>([]);
  const [existingTutorNames, setExistingTutorNames] = useState<string[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      className: '',
      tutorName: '',
      startDate: '',
      startTime: '',
      endTime: '',
      maxStudents: 12,
      status: 'scheduled',
      studentPhones: [],
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    if (!isOpen) return;
    const loadOptions = async () => {
      try {
        setLoadingOptions(true);
        const schedules = await getAllSchedules();
        setExistingClassNames(
          Array.from(new Set(schedules.map(s => s.className).filter(Boolean))).sort()
        );
        setExistingTutorNames(
          Array.from(new Set(schedules.map(s => s.tutorName).filter(Boolean))).sort()
        );
      } catch (error) {
        console.error('Error loading existing options:', error);
      } finally {
        setLoadingOptions(false);
      }
    };
    loadOptions();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    form.reset({
      className: initialData?.className || '',
      tutorName: initialData?.tutorName || '',
      startDate: initialData?.startDate || '',
      startTime: initialData?.startTime || '',
      endTime: initialData?.endTime || '',
      maxStudents: initialData?.maxStudents || 12,
      status: initialData?.status || 'scheduled',
      studentPhones: initialData?.studentPhones || [],
    });
    setSuccessMessage(null);
    setGeneralError(null);
  }, [initialData, isOpen, form]);

  const onSubmit = async (values: ScheduleFormValues) => {
    setGeneralError(null);
    setSuccessMessage(null);
    try {
      await onSave(values);
      setSuccessMessage('Đã lưu lịch học!');
      setTimeout(onClose, 1200);
    } catch (error: unknown) {
      setGeneralError(error instanceof Error ? error.message : 'Có lỗi khi lưu lịch học');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Chỉnh sửa lịch học' : 'Thêm lịch học mới'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Cập nhật thông tin lịch học' : 'Điền thông tin để tạo lịch học mới'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="className"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên lớp học *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={loadingOptions ? 'Đang tải...' : 'Chọn lớp học'}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {existingClassNames.map(name => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Hoặc nhập tên lớp mới..."
                      value={field.value}
                      onChange={field.onChange}
                      className="mt-2"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tutorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên giáo viên *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={loadingOptions ? 'Đang tải...' : 'Chọn giáo viên'}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {existingTutorNames.map(name => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Hoặc nhập tên giáo viên mới..."
                      value={field.value}
                      onChange={field.onChange}
                      className="mt-2"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày khai giảng *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giờ bắt đầu *</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giờ kết thúc *</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                      <SelectItem value="ongoing">Đang diễn ra</SelectItem>
                      <SelectItem value="completed">Hoàn thành</SelectItem>
                      <SelectItem value="cancelled">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {successMessage && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}
            {generalError && (
              <Alert variant="destructive">
                <AlertDescription>{generalError}</AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Lưu
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleForm;
