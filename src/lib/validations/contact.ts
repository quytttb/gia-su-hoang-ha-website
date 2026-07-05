import { z } from 'zod';
import { emailSchema, messageSchema, nameSchema, phoneSchema } from './common';

export const contactSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  message: messageSchema,
});

export type ContactFormValues = z.infer<typeof contactSchema>;
