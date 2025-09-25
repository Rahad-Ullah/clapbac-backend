import { z } from 'zod';
import { SupportStatus } from './support.constant';

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

// update zod schema for support module
const updateSupportZodSchema = z.object({
  body: z
    .object({
      status: z
        .nativeEnum(SupportStatus, {
          invalid_type_error: 'Invalid status value',
        })
        .optional(),
    })
    .strict(),
});

export const SupportValidations = {
  createSupportZodSchema,
  updateSupportZodSchema,
};
