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

export const SupportController = { createSupport };
