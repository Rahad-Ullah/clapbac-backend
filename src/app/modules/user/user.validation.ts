import { z } from 'zod';
import { USER_ROLES, USER_STATUS } from './user.constant';

const createOwnerZodSchema = z.object({
  body: z.object({
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
      .min(8, 'Password must be at least 8 characters long'),
    phone: z
      .string({ required_error: 'Phone is required' })
      .min(10, 'Phone must be at least 10 characters long')
      .max(15, 'Phone must be at most 15 characters long'),
    company: z.string({ required_error: 'Company is required' }).nonempty('Company cannot be empty'),
    category: z.string({ required_error: 'Category is required' }).nonempty('Category cannot be empty'),
    title: z.string({ required_error: 'Title is required' }).nonempty('Title cannot be empty'),
    website: z.string().url('Invalid website URL').nonempty('Website cannot be empty'),
  }),
});

const updateOwnerZodSchema = z.object({
  name: z.string().optional(),
  contact: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  location: z.string().optional(),
  image: z.string().optional(),
  role: z.nativeEnum(USER_ROLES).optional(),
  status: z.nativeEnum(USER_STATUS).optional(),
});

export const UserValidation = {
  createOwnerZodSchema,
  updateOwnerZodSchema,
};
