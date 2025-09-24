import { Request, Response, NextFunction } from 'express';
import { DisclaimerServices } from './disclaimer.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

// create or update disclaimer
const createUpdateDisclaimer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await DisclaimerServices.createUpdateDisclaimer(payload);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Disclaimer updated successfully',
      data: result,
    });
  }
);

// get disclaimer by type
const getDisclaimerByType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const type = req.params.type;
    const result = await DisclaimerServices.getAllDisclaimer(type);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Disclaimer fetched successfully',
      data: result,
    });
  }
);

export const DisclaimerController = { createUpdateDisclaimer, getDisclaimerByType };
