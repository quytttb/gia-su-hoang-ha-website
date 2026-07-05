import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  tutorRegistrationSchema,
  TutorRegistrationFormValues,
} from '@/lib/validations/tutor-registration';

interface TutorRegistrationFormProps {
  submitting: boolean;
  onSubmit: (data: TutorRegistrationFormValues) => void;
}

const TutorRegistrationForm = ({ submitting, onSubmit }: TutorRegistrationFormProps) => {
  const form = useForm<TutorRegistrationFormValues>({
    resolver: zodResolver(tutorRegistrationSchema),
    defaultValues: {
      parentName: '',
      parentPhone: '',
      parentAddress: '',
      name: '',
      school: '',
      academicDescription: '',
      tutorCriteria: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-black dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              Thông tin Phụ Huynh
            </h2>
            {(['parentName', 'parentPhone', 'parentAddress'] as const).map(field => (
              <FormField
                key={field}
                control={form.control}
                name={field}
                render={({ field: f }) => (
                  <FormItem>
                    <FormLabel>
                      {field === 'parentName'
                        ? 'Họ và tên phụ huynh'
                        : field === 'parentPhone'
                          ? 'Số điện thoại phụ huynh'
                          : 'Địa chỉ phụ huynh'}{' '}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={field === 'parentPhone' ? 'tel' : 'text'}
                        {...f}
                        placeholder={
                          field === 'parentName'
                            ? 'Nhập họ và tên phụ huynh'
                            : field === 'parentPhone'
                              ? 'Nhập số điện thoại phụ huynh'
                              : 'Nhập địa chỉ phụ huynh'
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-black dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              Thông tin Học Viên
            </h2>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Họ và tên <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ và tên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="school"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Trường học <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên trường học" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="academicDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Mô tả lực học <span className="text-gray-500 text-xs">(không bắt buộc)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Mô tả ngắn gọn về lực học hiện tại"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="tutorCriteria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Mô tả tiêu chí tìm Gia sư <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="Mô tả chi tiết về yêu cầu Gia sư..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="pt-6">
          <Button type="submit" disabled={submitting} className="w-full mb-4 py-3">
            {submitting ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Đang xử lý...
              </>
            ) : (
              'Gửi yêu cầu tìm Gia sư'
            )}
          </Button>
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">Hoặc tư vấn qua:</p>
            <Button
              type="button"
              variant="secondary"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => window.open('https://zalo.me/0385510892', '_blank')}
            >
              <img src="/images/zalo-logo.svg" alt="Zalo" className="w-5 h-5 mr-2" />
              Tư vấn qua Zalo
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default TutorRegistrationForm;
