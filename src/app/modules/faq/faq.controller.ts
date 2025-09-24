import { Request, Response, NextFunction } from 'express';
import { FaqServices } from './faq.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

// create faq controller
const createFaq = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...payload } = req.body;
    const result = await FaqServices.createFaqToDB(payload);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Faq created successfully',
      data: result,
    });
  }
);

export const FaqController = { createFaq };
