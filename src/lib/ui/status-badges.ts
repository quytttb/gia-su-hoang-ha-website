import type { BadgeProps } from '@/components/ui/badge';
import type { Registration } from '@/types';
import type { ContactMessage } from '@/actions/contact-admin';

type BadgeVariant = NonNullable<BadgeProps['variant']>;

export const registrationStatusConfig: Record<
  Registration['status'],
  { label: string; variant: BadgeVariant }
> = {
  pending: { label: 'Chờ duyệt', variant: 'warning' },
  approved: { label: 'Đã duyệt', variant: 'success' },
  rejected: { label: 'Đã từ chối', variant: 'destructive' },
  cancelled: { label: 'Đã hủy', variant: 'secondary' },
  completed: { label: 'Hoàn thành', variant: 'default' },
  matched: { label: 'Đã ghép lớp', variant: 'info' },
  trial_scheduled: { label: 'Đã xếp lịch học thử', variant: 'info' },
};

export const contactStatusConfig: Record<
  ContactMessage['status'],
  { label: string; variant: BadgeVariant }
> = {
  new: { label: 'Mới', variant: 'default' },
  read: { label: 'Đã đọc', variant: 'warning' },
  replied: { label: 'Đã trả lời', variant: 'success' },
  archived: { label: 'Đã đóng', variant: 'secondary' },
};

export const scheduleStatusConfig: Record<
  'active' | 'inactive',
  { label: string; variant: BadgeVariant }
> = {
  active: { label: 'Hoạt động', variant: 'success' },
  inactive: { label: 'Đã qua', variant: 'secondary' },
};

export const blogPostStatusConfig: Record<
  'draft' | 'published' | 'archived',
  { label: string; variant: BadgeVariant }
> = {
  draft: { label: 'Nháp', variant: 'secondary' },
  published: { label: 'Xuất bản', variant: 'success' },
  archived: { label: 'Lưu trữ', variant: 'destructive' },
};
