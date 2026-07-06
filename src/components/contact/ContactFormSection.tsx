import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2 } from 'lucide-react';
import SectionHeading from '../shared/SectionHeading';
import EmailServiceStatus from '../shared/EmailServiceStatus';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
        <SectionHeading title="Gửi Tin Nhắn" variant="left" />
        <Alert className="border-primary/30 bg-primary/10 [&>svg]:text-primary">
          <Check className="h-5 w-5" aria-hidden="true" />
          <AlertTitle>Gửi tin nhắn thành công!</AlertTitle>
          <AlertDescription>
            Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ phản hồi lại trong thời gian sớm nhất.
            <Button
              type="button"
              variant="link"
              className="mt-4 p-0 h-auto"
              onClick={() => {
                form.reset();
                onResetSuccess();
              }}
            >
              Gửi tin nhắn khác
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <SectionHeading title="Gửi Tin Nhắn" variant="left" />
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
