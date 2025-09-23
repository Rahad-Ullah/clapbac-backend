import { z } from 'zod';

const createVerifyEmailZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email format')
      .nonempty('Email is required'),
    oneTimeCode: z.number({ required_error: 'One time code is required' }),
  }),
});

const createLoginZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email format')
      .nonempty('Email cannot be empty'),
    password: z
      .string({ required_error: 'Password is required' })
      .nonempty('Password cannot be empty'),
  }),
});

const createForgetPasswordZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email format')
      .nonempty('Email is required'),
  }),
});

const createResetPasswordZodSchema = z.object({
  body: z.object({
    newPassword: z
      .string({ required_error: 'Password is required' })
      .nonempty('Password cannot be empty')
      .min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z
      .string({
        required_error: 'Confirm Password is required',
      })
      .nonempty('Confirm Password cannot be empty')
      .min(8, 'Confirm Password must be at least 8 characters long'),
  }),
});

const createChangePasswordZodSchema = z.object({
  body: z.object({
    currentPassword: z
      .string({
        required_error: 'Current Password is required',
      })
      .nonempty('Current Password cannot be empty'),
    newPassword: z
      .string({ required_error: 'New Password is required' })
      .nonempty('New Password cannot be empty'),
    confirmPassword: z
      .string({
        required_error: 'Confirm Password is required',
      })
      .nonempty('Confirm Password cannot be empty'),
  }),
});

export const AuthValidation = {
  createVerifyEmailZodSchema,
  createForgetPasswordZodSchema,
  createLoginZodSchema,
  createResetPasswordZodSchema,
  createChangePasswordZodSchema,
};
