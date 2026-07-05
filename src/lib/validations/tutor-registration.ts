import { z } from 'zod';
import { nameSchema, phoneSchema, requiredString } from './common';

export const tutorRegistrationSchema = z.object({
  parentName: requiredString('họ tên phụ huynh'),
  parentPhone: phoneSchema,
  parentAddress: requiredString('địa chỉ phụ huynh'),
  name: nameSchema,
  school: requiredString('trường học'),
  academicDescription: z.string().optional(),
  tutorCriteria: requiredString('tiêu chí tìm Gia sư'),
});

export type TutorRegistrationFormValues = z.infer<typeof tutorRegistrationSchema>;
