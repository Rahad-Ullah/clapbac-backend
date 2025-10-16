import { Request, Response, NextFunction } from 'express';
import { ReviewServices } from './review.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { cachedReviewers } from '../../../DB/cache';

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

// get all reviews
const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewServices.getAllReviews(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reviews retrieved successfully',
    data: result.data,
    pagination: result.pagination,
  });
});

// get all reviewers
const getAllReviewers = catchAsync(async (req: Request, res: Response) => {
  const now = Date.now();
  const cacheDuration = 5 * 60 * 1000; // 5 minutes

  // Create a unique cache key from query params (includes reviewerType, page, etc.)
  const cacheKey = JSON.stringify(req.query);

  let data;
  let message;

  // Try to retrieve from cache
  const cacheItem = cachedReviewers.get(cacheKey);

  // Check if cache exists and is still valid
  if (cacheItem && now - cacheItem.lastFetched < cacheDuration) {
    data = cacheItem.data;
    message = 'Reviewers retrieved from cache';
  } else {
    // Cache miss or expired → fetch fresh data
    data = await ReviewServices.getAllReviewers(req.query);
    message = 'Reviewers retrieved from database';

    // Save new data in cache
    cachedReviewers.set(cacheKey, {
      data,
      lastFetched: now,
    });
  }

  // Send API response
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message,
    data: data?.data,
    pagination: data?.pagination,
  });
});


export const ReviewController = { createReview, updateReview, getReviewByCompanyId, getAllReviews, getAllReviewers };
