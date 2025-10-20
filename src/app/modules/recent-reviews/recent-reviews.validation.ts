import { z } from 'zod';

// create recent reviews validations here
const createRecentReviewsZodSchema = z.object({
  body: z
    .object({
      review: z
        .string({ required_error: 'Review ID is required' })
        .nonempty('Review ID cannot be empty')
        .length(24, 'Review ID must be a valid ObjectId'),
    })
    .strict(),
});

export const RecentReviewsValidations = { createRecentReviewsZodSchema };
