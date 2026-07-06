import { z } from 'zod';
import { requiredString } from './common';

export const scheduleFormSchema = z
  .object({
    className: requiredString('tên lớp'),
    tutorName: requiredString('tên giáo viên'),
    startDate: requiredString('ngày học'),
    startTime: requiredString('giờ bắt đầu'),
    endTime: requiredString('giờ kết thúc'),
    maxStudents: z.number().min(1, 'Số học viên tối thiểu là 1').max(100),
    status: z.enum(['scheduled', 'ongoing', 'completed', 'cancelled']),
    studentPhones: z.array(z.string()),
  })
  .superRefine((data, ctx) => {
    if (data.startTime && data.endTime && data.startTime >= data.endTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Giờ kết thúc phải sau giờ bắt đầu',
        path: ['endTime'],
      });
    }
    if (data.startDate) {
      const selectedDate = new Date(data.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Không thể chọn ngày trong quá khứ',
          path: ['startDate'],
        });
      }
    }
  });

export type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

export const tutorFormSchema = z.object({
  name: requiredString('họ tên'),
  specialty: requiredString('chuyên môn'),
  bio: requiredString('giới thiệu'),
  imageUrl: z.string().min(1, 'Ảnh giáo viên là bắt buộc'),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  phone: z.string().optional(),
  isActive: z.boolean(),
});

export type TutorFormValues = z.infer<typeof tutorFormSchema>;

export const classFormSchema = z.object({
  name: requiredString('tên lớp'),
  description: requiredString('mô tả'),
  price: z.number().min(0, 'Học phí không hợp lệ'),
  category: requiredString('danh mục'),
  schedule: z.string().optional(),
  maxStudents: z.number().min(1).optional(),
  imageUrl: z.string().min(1, 'Ảnh lớp học là bắt buộc'),
  featured: z.boolean(),
  isActive: z.boolean(),
  discount: z.number().min(0).max(100),
  discountEndDate: z.string().optional(),
});

export type ClassFormValues = z.infer<typeof classFormSchema>;

export const bannerFormSchema = z.object({
  title: requiredString('tiêu đề'),
  subtitle: z.string().optional(),
  imageUrl: z.string().min(1, 'Hình ảnh là bắt buộc'),
  link: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
  isActive: z.boolean(),
  order: z.number().min(1, 'Thứ tự phải lớn hơn 0'),
});

export type BannerFormValues = z.infer<typeof bannerFormSchema>;

export const blogPostFormSchema = z.object({
  title: requiredString('tiêu đề'),
  subtitle: z.string().optional(),
  contentMarkdown: requiredString('nội dung'),
  categoryId: requiredString('chủ đề'),
  tagsInput: z.string().optional(),
  featured: z.boolean(),
  status: z.enum(['draft', 'published', 'archived']),
  coverImage: z.string().optional(),
});

export type BlogPostFormValues = z.infer<typeof blogPostFormSchema>;
