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
      message: 'Support created successfully',
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

export const SupportController = { createSupport, updateSupport };
