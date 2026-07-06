import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Schedule } from '../../types';
import { formatDate } from '../../utils/helpers';
import SectionHeading from '../shared/SectionHeading';
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
import { schedulePhoneSchema, SchedulePhoneFormValues } from '@/lib/validations/schedule';

interface PersonalSchedulePanelProps {
  loading: boolean;
  showPersonalSchedules: boolean;
  personalSchedules: Schedule[];
  onPhoneSubmit: (phone: string) => Promise<void>;
  onReset: () => void;
}

const PersonalSchedulePanel = ({
  loading,
  showPersonalSchedules,
  personalSchedules,
  onPhoneSubmit,
  onReset,
}: PersonalSchedulePanelProps) => {
  const form = useForm<SchedulePhoneFormValues>({
    resolver: zodResolver(schedulePhoneSchema),
    defaultValues: { phone: '' },
  });

  const handleSubmit = async (data: SchedulePhoneFormValues) => {
    await onPhoneSubmit(data.phone);
  };

  return (
    <div>
      <SectionHeading title="Lịch học cá nhân" variant="left" />

      {!showPersonalSchedules ? (
        <div className="bg-background p-6 rounded-lg shadow-md">
          <p className="text-foreground mb-4">
            Nhập số điện thoại của bạn để xem lịch học cá nhân.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Nhập số điện thoại của bạn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tìm kiếm...
                  </>
                ) : (
                  'Tìm kiếm'
                )}
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        <div className="bg-background p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-foreground">Lịch học của bạn</h3>
            <Button type="button" variant="link" className="text-sm p-0 h-auto" onClick={onReset}>
              Tìm kiếm khác
            </Button>
          </div>
          {personalSchedules.length > 0 ? (
            <div className="space-y-4">
              {personalSchedules.map(schedule => (
                <div
                  key={schedule.id}
                  className="border-b border-border pb-4 last:border-0 hover:bg-muted/50 p-4 rounded-lg"
                >
                  <p className="font-medium text-foreground">{schedule.className}</p>
                  <p className="text-sm text-muted-foreground">
                    Ngày: {formatDate(schedule.startDate)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Giờ: {schedule.startTime} - {schedule.endTime}
                  </p>
                  <p className="text-sm text-muted-foreground">Giáo viên: {schedule.tutorName}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">
                Không tìm thấy lịch học nào cho số điện thoại này.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 bg-muted p-6 rounded-lg">
        <h3 className="font-semibold text-foreground mb-3">Thông tin liên hệ</h3>
        <p className="text-foreground text-sm mb-2">
          Nếu bạn gặp vấn đề khi xem lịch học, vui lòng liên hệ với chúng tôi:
        </p>
        <p className="text-foreground text-sm">Điện thoại: 0385.510.892 - 0962.390.161</p>
        <p className="text-foreground text-sm">Email: lienhe@giasuhoangha.com</p>
      </div>
    </div>
  );
};

export default PersonalSchedulePanel;
