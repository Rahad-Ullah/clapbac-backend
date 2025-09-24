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
      relatedTo: z.array(z.string(), {
        invalid_type_error: 'RelatedTo must be an array of category ids',
      }).optional(),
    })
    .strict(),
});

// update category validation
const updateCategoryZodSchema = z.object({
  body: z
    .object({
      name: z
        .string({ required_error: 'Name is required' })
        .nonempty('Name cannot be empty')
        .optional(),
      image: z
        .string({ required_error: 'Icon image is required' })
        .nonempty('Icon image cannot be empty')
        .optional(),
      relatedTo: z
        .array(z.string(), {
          invalid_type_error: 'RelatedTo must be an array of category ids',
        })
        .optional(),
    })
    .strict(),
});

export const CategoryValidations = { createCategoryZodSchema, updateCategoryZodSchema };
