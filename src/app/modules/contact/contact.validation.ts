import { z } from 'zod';

// create or update contact info
const createUpdateContactInfoZodSchema = z.object({
  body: z
    .object({
      email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email format')
        .optional(),
      phone: z
        .string({ required_error: 'Phone is required' })
        .min(10, 'Phone must be at least 10 characters long')
        .max(15, 'Phone must be at most 15 characters long')
        .optional(),
      address: z.string({ required_error: 'Address is required' }).optional(),
    })
    .strict(),
});

export const ContactValidations = { createUpdateContactInfoZodSchema };
