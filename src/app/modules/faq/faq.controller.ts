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

// update faq controller
const updateFaq = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { ...payload } = req.body;
    const result = await FaqServices.updateFaqToDB(id, payload);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Faq updated successfully',
      data: result,
    });
  }
);

// delete faq controller
const deleteFaq = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await FaqServices.deleteFaqFromDB(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Faq deleted successfully',
      data: result,
    });
  }
);

// get all faqs controller
const getAllFaqs = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await FaqServices.getAllFaqsFromDB();

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Faqs retrieved successfully',
      data: result,
    });
  }
);

export const FaqController = { createFaq, updateFaq, deleteFaq, getAllFaqs };
