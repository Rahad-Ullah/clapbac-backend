import { z } from 'zod';

// create faq validation
const createFaqZodSchema = z.object({
  body: z
    .object({
      question: z
        .string({ required_error: 'Question is required' })
        .nonempty('Question cannot be empty'),
      answer: z
        .string({ required_error: 'Answer is required' })
        .nonempty('Answer cannot be empty'),
    })
    .strict(),
});

export const FaqValidations = { createFaqZodSchema };
