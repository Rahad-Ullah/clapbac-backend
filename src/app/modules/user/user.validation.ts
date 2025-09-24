import { z } from 'zod';
import { USER_STATUS } from './user.constant';

const createOwnerZodSchema = z.object({
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
        .email('Invalid email'),
      password: z
        .string({ required_error: 'Password is required' })
        .nonempty('Password cannot be empty'),
      phone: z
        .string({ required_error: 'Phone is required' })
        .min(10, 'Phone must be at least 10 characters long')
        .max(15, 'Phone must be at most 15 characters long'),
      companyName: z
        .string({ required_error: 'Company name is required' })
        .nonempty('Company name cannot be empty'),
      businessCategory: z
        .string({ required_error: 'Business category is required' })
        .nonempty('Business category cannot be empty'),
      title: z
        .string({ required_error: 'Title is required' })
        .nonempty('Title cannot be empty'),
      website: z
        .string({ required_error: 'Website is required' })
        .nonempty('Website cannot be empty'),
    })
    .strict('Unnecessary fields are not allowed'),
});

const updateUserZodSchema = z.object({
  body: z
    .object({
      firstName: z.string().nonempty('First name cannot be empty').optional(),
      lastName: z.string().nonempty('Last name cannot be empty').optional(),
      phone: z
        .string()
        .min(10, 'Phone must be at least 10 characters long')
        .max(15, 'Phone must be at most 15 characters long')
        .optional(),
      title: z.string().nonempty('Title cannot be empty').optional(),
      status: z.nativeEnum(USER_STATUS).optional(),
      adminNotes: z.string().optional(),
    })
    .strict('Unnecessary fields are not allowed'),
});

export const UserValidation = {
  createOwnerZodSchema,
  updateUserZodSchema,
};
