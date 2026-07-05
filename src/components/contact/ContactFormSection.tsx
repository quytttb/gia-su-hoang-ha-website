import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2 } from 'lucide-react';
import SectionHeading from '../shared/SectionHeading';
import EmailServiceStatus from '../shared/EmailServiceStatus';
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
import { contactSchema, ContactFormValues } from '@/lib/validations/contact';

interface ContactFormSectionProps {
  loading: boolean;
  success: boolean;
  onSubmit: (data: ContactFormValues) => Promise<void>;
  onResetSuccess: () => void;
}

const ContactFormSection = ({
  loading,
  success,
  onSubmit,
  onResetSuccess,
}: ContactFormSectionProps) => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', phone: '', email: '', message: '' },
  });

  if (success) {
    return (
      <div>
        <SectionHeading title="Gửi Tin Nhắn" centered={false} />
        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg dark:bg-green-900/20">
          <div className="flex items-center">
            <Check className="h-6 w-6 text-green-500 flex-shrink-0" aria-hidden="true" />
            <div className="ml-3">
              <h3 className="text-lg font-medium text-green-800 dark:text-green-300">
                Gửi tin nhắn thành công!
              </h3>
              <p className="mt-2 text-sm text-green-700 dark:text-green-400">
                Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ phản hồi lại trong thời gian sớm
                nhất.
              </p>
              <Button
                type="button"
                variant="link"
                className="mt-4 p-0 h-auto text-green-700 dark:text-green-400"
                onClick={() => {
                  form.reset();
                  onResetSuccess();
                }}
              >
                Gửi tin nhắn khác
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeading title="Gửi Tin Nhắn" centered={false} />
      <EmailServiceStatus />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ tên *</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập họ tên của bạn" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại *</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="Nhập số điện thoại của bạn"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Nhập địa chỉ email của bạn"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tin nhắn *</FormLabel>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder="Nhập tin nhắn của bạn"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang gửi
              </>
            ) : (
              'Gửi tin nhắn'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactFormSection;
