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
        .min(0.5, { message: 'Review rating must be at least 0.5' })
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
      clapbacTitle: z
        .string({ required_error: 'Clapbac title is required' })
        .nonempty({ message: 'Clapbac title cannot be empty' }),
      clapbacMessage: z
        .string({ required_error: 'Clapbac message is required' })
        .nonempty({ message: 'Clapbac message cannot be empty' }),
      clapbacRating: z
        .number({ required_error: 'Clapbac rating is required' })
        .min(0.5, { message: 'Clapbac rating must be at least 0.5' })
        .max(5, { message: 'Clapbac rating cannot be more than 5' }),
      reviewerType: z
        .string({ required_error: 'Reviewer type is required' })
        .nonempty({ message: 'Reviewer type cannot be empty' }),
      reviewerConsequence: z
        .string({
          required_error: 'Reviewer consequence is required',
        })
        .nonempty({ message: 'Reviewer consequence cannot be empty' }),
    })
    .strict(),
});

// update review validation
const updateReviewZodSchema = z.object({
  body: z
    .object({
      reviewerName: z
        .string({ required_error: 'Reviewer name is required' })
        .nonempty({ message: 'Reviewer name cannot be empty' })
        .optional(),
      reviewRating: z
        .number({ required_error: 'Review rating is required' })
        .min(0.5, { message: 'Review rating must be at least 0.5' })
        .max(5, { message: 'Review rating cannot be more than 5' })
        .optional(),
      reviewMessage: z
        .string({ required_error: 'Review message is required' })
        .nonempty({ message: 'Review message cannot be empty' })
        .optional(),
      reviewSource: z
        .string({ required_error: 'Review source is required' })
        .nonempty({ message: 'Review source cannot be empty' })
        .optional(),
      sourceLink: z
        .string({ required_error: 'Source link is required' })
        .url({ message: 'Source link must be a valid URL' })
        .optional(),
      experienceDate: z
        .string({ required_error: 'Experience date is required' })
        .nonempty({ message: 'Experience date cannot be empty' })
        .optional(),
      clapbacTitle: z
        .string({ required_error: 'Clapbac title is required' })
        .nonempty({ message: 'Clapbac title cannot be empty' })
        .optional(),
      clapbacMessage: z
        .string({ required_error: 'Clapbac message is required' })
        .nonempty({ message: 'Clapbac message cannot be empty' })
        .optional(),
      clapbacRating: z
        .number({ required_error: 'Clapbac rating is required' })
        .min(0.5, { message: 'Clapbac rating must be at least 0.5' })
        .max(5, { message: 'Clapbac rating cannot be more than 5' })
        .optional(),
      reviewerType: z
        .string({ required_error: 'Reviewer type is required' })
        .nonempty({ message: 'Reviewer type cannot be empty' })
        .optional(),
      reviewerConsequence: z
        .string({
          required_error: 'Reviewer consequence is required',
        })
        .nonempty({ message: 'Reviewer consequence cannot be empty' })
        .optional(),
    })
    .strict(),
});

export const ReviewValidations = { createReviewZodSchema, updateReviewZodSchema };
