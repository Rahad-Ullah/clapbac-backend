import { z } from 'zod';

// update company validation schema
const updateCompanyZodSchema = z.object({
  body: z
    .object({
      name: z.string().nonempty('Name cannot be empty').optional(),
      category: z.string().nonempty('Category cannot be empty').optional(),
      image: z.string().optional(),
      about: z.string().nonempty('About cannot be empty').optional(),
      address: z.string().nonempty('Address cannot be empty').optional(),
      website: z.string().nonempty('Website cannot be empty').optional(),
      email: z.string().email().nonempty('Email cannot be empty').optional(),
      phone: z.string().nonempty('Phone cannot be empty').optional(),
      isFeatured: z.boolean().optional(),
    })
    .strict('Unnecessary fields are not allowed'),
});

export const CompanyValidations = { updateCompanyZodSchema };
