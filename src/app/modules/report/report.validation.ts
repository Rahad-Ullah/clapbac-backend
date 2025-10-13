import { z } from 'zod';

// create report validation
const createReportZodSchema = z.object({
    body: z
        .object({
            review: z
                .string({ required_error: 'Review ID is required' })
                .nonempty('Review ID cannot be empty')
                .length(24, 'Review ID must be a valid ObjectId'),
            reason: z
                .string({ required_error: 'Reason is required' })
                .nonempty('Reason cannot be empty'),
        })
        .strict(),
});

export const ReportValidations = { createReportZodSchema };
