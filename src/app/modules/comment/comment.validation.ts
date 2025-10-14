import { z } from 'zod';

// create comment validation
const createCommentZodSchema = z.object({
  body: z
    .object({
      review: z
        .string({ required_error: 'Review ID is required' })
        .nonempty('Review ID cannot be empty')
        .length(24, 'Review ID must be a valid ObjectId'),
      message: z
        .string({ required_error: 'Message is required' })
        .nonempty('Message cannot be empty'),
      parent: z
        .string()
        .nonempty('Parent ID cannot be empty')
        .length(24, 'Parent ID must be a valid ObjectId')
        .optional(),
    })
    .strict('Unknown fields are not allowed'),
});

export const CommentValidations = { createCommentZodSchema };
