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

// get all reviewers
const getAllReviewers = catchAsync(async (req: Request, res: Response) => {
  const now = Date.now();
  const cacheDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
  let data;
  let message;

  // get reviewers from cache if type is provided
  if (req.query.reviewerType) {
    const cacheItem = cachedReviewers.find(
      (reviewer: any) => reviewer.reviewerType === req.query.reviewerType
    );
    // check if the cache is still valid
    if (cacheItem && now - cacheItem.lastFetched < cacheDuration) {
      data = cacheItem.data;
      message = 'Reviewers retrieved from cache';
    } else {
      data = await ReviewServices.getAllReviewers(req.query);
      message = 'Reviewers retrieved from database';
      cachedReviewers.push({
        reviewerType: req.query.reviewerType as string,
        data,
        lastFetched: now,
      });
    }
  } else {
    // get reviewers from cache if type is not provided
    const cacheItem = cachedReviewers.find(
      (reviewer: any) => reviewer.reviewerType === null
    );
    // check if the cache is still valid
    if (cacheItem && now - cacheItem.lastFetched < cacheDuration) {
      data = cacheItem.data;
      message = 'Reviewers retrieved from cache';
    } else {
      data = await ReviewServices.getAllReviewers(req.query);
      message = 'Reviewers retrieved from database';
      cachedReviewers.push({ reviewerType: null, data, lastFetched: now });
    }
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: message,
    data: data.data,
    pagination: data.pagination,
  });
});

export const ReviewController = { createReview, updateReview, getReviewByCompanyId, getAllReviewers };
