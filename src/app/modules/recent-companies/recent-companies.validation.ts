import { z } from 'zod';

// create recent companies validations here
const createRecentCompaniesZodSchema = z.object({
  body: z
    .object({
      company: z
        .string({ required_error: 'Company ID is required' })
        .nonempty('Company ID cannot be empty'),
    })
    .strict(),
});

export const RecentCompaniesValidations = { createRecentCompaniesZodSchema };
