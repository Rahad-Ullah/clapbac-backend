import { Request, Response, NextFunction } from 'express';
import { ReviewServices } from './review.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

// create review controller
const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = { ...req.body, user: req.user.id };
    const result = await ReviewServices.createReviewToDB(payload);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Review created successfully',
      data: result,
    });
  }
);

// update review
const updateReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await ReviewServices.updateReviewToDB(id, payload);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Review updated successfully',
    data: result,
  });
});

// get review by company id
const getReviewByCompanyId = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ReviewServices.getReviewByCompanyId(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Review retrieved successfully',
    data: result,
  });
});

// get all reviewers
const getAllReviewers = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewServices.getAllReviewers(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reviewers retrieved successfully',
    data: result.data,
    pagination: result.pagination as any
  });
});

export const ReviewController = { createReview, updateReview, getReviewByCompanyId, getAllReviewers };
