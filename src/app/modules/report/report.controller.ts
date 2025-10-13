import { Request, Response } from 'express';
import { ReportServices } from './report.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

// create report
const createReport = catchAsync(async (req: Request, res: Response) => {
  const payload = { ...req.body, user: req.user.id };
  const result = await ReportServices.createReport(payload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Report created successfully',
    data: result,
  });
});

export const ReportController = { createReport };
