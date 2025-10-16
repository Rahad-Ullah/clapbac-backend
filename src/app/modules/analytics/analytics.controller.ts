import { Request, Response, NextFunction } from 'express';
import { AnalyticsServices } from './analytics.service';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';
import { StatusCodes } from 'http-status-codes';

// get dashboard overview
const getDashboardOverview = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsServices.getDashboardOverview();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Dashboard overview retrieved successfully',
    data: result,
  });
});

export const AnalyticsController = { getDashboardOverview };
