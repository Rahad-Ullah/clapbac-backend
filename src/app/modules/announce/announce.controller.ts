import { Request, Response, NextFunction } from 'express';
import { AnnounceServices } from './announce.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { AnnounceAudience } from './announce.constants';
import Redis from 'ioredis';
const redis = new Redis(); // defaults to localhost:6379

// create announce controller
const createAnnounce = catchAsync(async (req: Request, res: Response) => {
  const result = await AnnounceServices.createAnnounceToDB({
    ...req.body,
    createdBy: req.user.id,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Announce created successfully',
    data: result,
  });
});

// update announce controller
const updateAnnounce = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AnnounceServices.updateAnnounce(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Announce updated successfully',
    data: result,
  });
});

// delete announce controller
const archiveAnnounce = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AnnounceServices.archiveAnnounce(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Announce deleted successfully',
    data: result,
  });
});

// get active announce
const getActiveAnnounce = catchAsync(async (req: Request, res: Response) => {
  const audience =
    (req.params.audience as AnnounceAudience) || AnnounceAudience.ALL;
  const cachedData = await redis.get(`announce:active:${audience}`);
  let data, message;

  if (cachedData) {
    data = JSON.parse(cachedData);
    message = 'Announce retrieved from cache successfully';
  } else {
    // Fallback: fetch from DB if Redis misses
    data = await AnnounceServices.getActiveAnnounce(audience);
    message = 'Announce retrieved successfully';

    await redis.set(`announce:active:${audience}`, JSON.stringify(data));
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: message,
    data: data,
  });
});

// get all announces
const getAllAnnounces = catchAsync(async (req: Request, res: Response) => {
  const result = await AnnounceServices.getAllAnnounces(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Announces retrieved successfully',
    data: result.data,
    pagination: result.pagination,
  });
});

export const AnnounceController = {
  createAnnounce,
  updateAnnounce,
  archiveAnnounce,
  getActiveAnnounce,
  getAllAnnounces,
};
