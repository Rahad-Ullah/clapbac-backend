import { Request, Response, NextFunction } from 'express';
import { AnnounceServices } from './announce.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

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

export const AnnounceController = { createAnnounce };
