import { z } from 'zod';
import { ReportReason, ReportStatus } from './report.constants';

// create report validation
const createReportZodSchema = z.object({
  body: z
    .object({
      review: z
        .string({ required_error: 'Review ID is required' })
        .nonempty('Review ID cannot be empty')
        .length(24, 'Review ID must be a valid ObjectId'),
      reason: z.nativeEnum(ReportReason, {
        errorMap: () => {
          return { message: 'Invalid report reason' };
        },
      }),
    })
    .strict(),
});

// update report validation
const updateReportZodSchema = z.object({
  body: z
    .object({
      status: z.nativeEnum(ReportStatus).optional(),
    })
    .strict(),
});

export const ReportValidations = {
  createReportZodSchema,
  updateReportZodSchema,
};
