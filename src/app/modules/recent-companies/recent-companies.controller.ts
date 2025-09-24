import { Request, Response, NextFunction } from 'express';
import { RecentCompaniesServices } from './recent-companies.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

// create recent companies
const createRecentCompanies = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await RecentCompaniesServices.createRecentCompanies({
      ...req.body,
      user: req.user.id,
    });

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Recent companies created successfully!',
      data: result,
    });
  }
);

// get user recent companies
const getUserRecentCompanies = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await RecentCompaniesServices.getUserRecentCompanies(req.user.id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'User recent companies retrieved successfully!',
      data: result,
    });
  }
);

export const RecentCompaniesController = { createRecentCompanies, getUserRecentCompanies };
