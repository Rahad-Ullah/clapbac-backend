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
  getAllAnnounces,
};
