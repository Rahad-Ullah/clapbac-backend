import { Request, Response, NextFunction } from 'express';
import { ContactServices } from './contact.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

// create or update contact info
const createUpdateContact = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await ContactServices.createUpdateContact(payload);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Contact info created/updated successfully',
      data: result,
    });
  }
);

export const ContactController = { createUpdateContact };
