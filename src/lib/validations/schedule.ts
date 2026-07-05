import { z } from 'zod';
import { phoneSchema } from './common';

export const schedulePhoneSchema = z.object({
  phone: phoneSchema,
});

export type SchedulePhoneFormValues = z.infer<typeof schedulePhoneSchema>;
