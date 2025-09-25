import { z } from 'zod';

// create review validation
const createReviewZodSchema = z.object({
  body: z
    .object({
      reviewerName: z
        .string({ required_error: 'Reviewer name is required' })
        .nonempty({ message: 'Reviewer name cannot be empty' }),
      reviewRating: z
        .number({ required_error: 'Review rating is required' })
        .min(1, { message: 'Review rating must be at least 1' })
        .max(5, { message: 'Review rating cannot be more than 5' }),
      reviewMessage: z
        .string({ required_error: 'Review message is required' })
        .nonempty({ message: 'Review message cannot be empty' }),
      reviewSource: z
        .string({ required_error: 'Review source is required' })
        .nonempty({ message: 'Review source cannot be empty' }),
      sourceLink: z
        .string({ required_error: 'Source link is required' })
        .url({ message: 'Source link must be a valid URL' }),
      experienceDate: z
        .string({ required_error: 'Experience date is required' })
        .nonempty({ message: 'Experience date cannot be empty' }),
      clapbacTitle: z.string().optional(),
      clapbacMessage: z.string().optional(),
      clapbacRating: z.number().min(0).max(5).optional(),
      reviewerType: z.string().optional(),
      reviewerConsequence: z.string().optional(),
    })
    .strict(),
});

export const ReviewValidations = { createReviewZodSchema };
