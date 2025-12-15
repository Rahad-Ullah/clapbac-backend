import { Request, Response, NextFunction } from 'express';
import { ReviewServices } from './review.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { cachedReviewers } from '../../../DB/cache';
import { redis } from '../announce/announce.controller';
import { reviewCacheKey } from '../../../util/reviewCacheKey';

// extract review info by ai with redis caching
const extractReviewByAi = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { text } = req.body;

    const cacheKey = reviewCacheKey(text);
    const lockKey = `${cacheKey}:lock`;

    // Check Redis cache
    const cached = await redis.get(cacheKey);
    if (cached)
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Review extracted successfully (cache)',
        data: JSON.parse(cached),
      });

    // Try to lock
    const locked = await redis.set(lockKey, '1', 'EX', 15, 'NX');
    if (!locked) {
      // Someone else is processing → wait & retry
      await new Promise(r => setTimeout(r, 500));
      const retry = await redis.get(cacheKey);
      if (retry)
        return sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Review extracted successfully (cache)',
          data: JSON.parse(retry),
        });
    }

    // Call OpenAI
    const result = await ReviewServices.extractReview(text);

    // Save cache
    await redis.set(cacheKey, JSON.stringify(result), 'EX', 60 * 60 * 24 * 90);

    // Release lock (optional, EX handles safety)
    await redis.del(lockKey);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Review extracted successfully',
      data: result,
    });
  }
);

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


export const ReviewController = { extractReviewByAi, createReview, updateReview, getReviewByCompanyId, getAllReviews, getAllReviewers };
