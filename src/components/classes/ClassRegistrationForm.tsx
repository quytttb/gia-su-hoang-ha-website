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
  classRegistrationSchema,
  ClassRegistrationFormValues,
} from '@/lib/validations/class-registration';

interface ClassRegistrationFormProps {
  submitting: boolean;
  onSubmit: (data: ClassRegistrationFormValues) => void;
}

const ClassRegistrationForm = ({ submitting, onSubmit }: ClassRegistrationFormProps) => {
  const form = useForm<ClassRegistrationFormValues>({
    resolver: zodResolver(classRegistrationSchema),
    defaultValues: {
      parentName: '',
      parentPhone: '',
      parentAddress: '',
      name: '',
      school: '',
      academicDescription: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
              Thông tin Phụ Huynh
            </h2>
            {(['parentName', 'parentPhone', 'parentAddress'] as const).map(field => (
              <FormField
                key={field}
                control={form.control}
                name={field}
                render={({ field: f }) => (
                  <FormItem className="mb-5">
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
          <div>
            <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
              Thông tin Học Viên
            </h2>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-5">
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
                <FormItem className="mb-5">
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
                <FormItem className="mb-5">
                  <FormLabel>
                    Mô tả lực học{' '}
                    <span className="text-muted-foreground text-xs">(không bắt buộc)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Mô tả ngắn gọn về lực học hiện tại của học viên..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="mt-8">
          <Button type="submit" disabled={submitting} className="w-full mb-4 py-3">
            {submitting ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Đang xử lý...
              </>
            ) : (
              'Đăng ký ngay'
            )}
          </Button>
          <div className="text-center">
            <p className="text-muted-foreground text-xs mb-2">Hoặc tư vấn qua:</p>
            <Button
              type="button"
              variant="secondary"
              className="w-full bg-primary hover:bg-blue-600 text-white"
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

export default ClassRegistrationForm;
