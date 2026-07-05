import { z } from 'zod';
import { nameSchema, phoneSchema, requiredString } from './common';

export const classRegistrationSchema = z.object({
  parentName: requiredString('họ tên phụ huynh'),
  parentPhone: phoneSchema,
  parentAddress: requiredString('địa chỉ phụ huynh'),
  name: nameSchema,
  school: requiredString('trường học'),
  academicDescription: z.string().optional(),
});

export type ClassRegistrationFormValues = z.infer<typeof classRegistrationSchema>;
