import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { RecentReviewsServices } from './recent-reviews.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

// create recent reviews
const createRecentReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await RecentReviewsServices.createRecentReviews({
    ...req.body,
    user: req.user.id,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Recent reviews created successfully!',
    data: result,
  });
});

// get recent reviews
const getRecentReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await RecentReviewsServices.getUserRecentReviews(req.user.id)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Recent reviews retrieved successfully!',
    data: result,
  });
});

export const RecentReviewsController = { createRecentReviews, getRecentReviews };
