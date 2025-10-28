import { Request, Response, NextFunction } from 'express';
import { SupportServices } from './support.service';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';

// create support
const createSupport = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await SupportServices.createSupport(payload);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Thank you for your feedback',
      data: result,
    });
  }
);

// update support
const updateSupport = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const payload = req.body;
  const result = await SupportServices.updateSupport(id, payload);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Support updated successfully',
    data: result,
  });
});

// get all supports
const getAllSupports = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await SupportServices.getAllSupports(query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Supports retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  }
);

export const SupportController = { createSupport, updateSupport, getAllSupports };
