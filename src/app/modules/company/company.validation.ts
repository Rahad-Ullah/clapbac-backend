import { z } from 'zod';

// update company validation schema
const updateCompanyZodSchema = z.object({
  body: z
    .object({
      name: z.string().optional(),
      category: z.string().optional(),
      image: z.string().optional(),
      about: z.string().optional(),
      address: z.string().optional(),
      website: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      isFeatured: z.boolean().optional(),
    })
    .strict('Unnecessary fields are not allowed'),
});

export const CompanyValidations = { updateCompanyZodSchema };
