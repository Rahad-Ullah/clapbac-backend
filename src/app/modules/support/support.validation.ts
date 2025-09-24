import { z } from 'zod';

// create zod schema for support module
const createSupportZodSchema = z.object({
  body: z
    .object({
      firstName: z
        .string({ required_error: 'First name is required' })
        .nonempty('First name cannot be empty'),
      lastName: z
        .string({ required_error: 'Last name is required' })
        .nonempty('Last name cannot be empty'),
      email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email format')
        .nonempty('Email cannot be empty'),
      phone: z.string().optional(),
      subject: z
        .string({ required_error: 'Subject is required' })
        .nonempty('Subject cannot be empty'),
      message: z
        .string({ required_error: 'Message is required' })
        .nonempty('Message cannot be empty'),
    })
    .strict(),
});

export const SupportValidations = { createSupportZodSchema };
