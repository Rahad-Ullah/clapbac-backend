import { z } from 'zod';

// create category validation
const createCategoryZodSchema = z.object({
  body: z
    .object({
      name: z
        .string({ required_error: 'Name is required' })
        .nonempty('Name cannot be empty'),
      image: z
        .string({ required_error: 'Icon image is required' })
        .nonempty('Icon image cannot be empty')
        .optional(),
    })
    .strict(),
});

export const CategoryValidations = { createCategoryZodSchema };
