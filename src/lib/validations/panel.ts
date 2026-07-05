import { z } from 'zod';
import { requiredString } from './common';

export const scheduleFormSchema = z.object({
  className: requiredString('tên lớp'),
  tutorName: requiredString('tên giáo viên'),
  startDate: requiredString('ngày học'),
  startTime: requiredString('giờ bắt đầu'),
  endTime: requiredString('giờ kết thúc'),
  maxStudents: z.coerce.number().min(1, 'Số học viên tối thiểu là 1').max(100),
  status: z.enum(['scheduled', 'ongoing', 'completed', 'cancelled']),
  studentPhones: z.array(z.string()).default([]),
});

export type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

export const tutorFormSchema = z.object({
  name: requiredString('họ tên'),
  specialty: requiredString('chuyên môn'),
  bio: z.string().optional(),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  phone: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type TutorFormValues = z.infer<typeof tutorFormSchema>;

export const classFormSchema = z.object({
  name: requiredString('tên lớp'),
  description: requiredString('mô tả'),
  price: z.coerce.number().min(0, 'Học phí không hợp lệ'),
  category: requiredString('danh mục'),
  schedule: z.string().optional(),
  maxStudents: z.coerce.number().min(1).optional(),
});

export type ClassFormValues = z.infer<typeof classFormSchema>;

export const bannerFormSchema = z.object({
  title: requiredString('tiêu đề'),
  link: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  order: z.coerce.number().min(0).default(0),
});

export type BannerFormValues = z.infer<typeof bannerFormSchema>;
