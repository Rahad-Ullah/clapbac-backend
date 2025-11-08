import { Request, Response, NextFunction } from 'express';
import { CompanyServices } from './company.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { getSingleFilePath } from '../../../shared/getFilePath';

// update company
const updateCompany = catchAsync(async (req: Request, res: Response) => {
  const logo = getSingleFilePath(req.files, 'image');

  const result = await CompanyServices.updateCompany(req.params.id, {
    ...req.body,
    logo,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Company updated successfully!',
    data: result,
  });
});

// toggle featured company
const toggleFeaturedCompany = catchAsync(async (req: Request, res: Response) => {
  const result = await CompanyServices.toggleFeaturedCompany(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Company updated successfully!',
    data: result,
  });
});

// get single by id
const getSingleById = catchAsync(async (req: Request, res: Response) => {
  const result = await CompanyServices.getSingleById(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Company retrieved successfully!',
    data: result,
  });
});

// get my company
const getMyCompany = catchAsync(async (req: Request, res: Response) => {
  const result = await CompanyServices.getMyCompany(req.user.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Company retrieved successfully!',
    data: result,
  });
})

// get all companies
const getAllCompanies = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await CompanyServices.getAllCompanies(req.query);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Companies retrieved successfully!',
      data: result.data,
      pagination: result.pagination,
    });
  }
);

export const CompanyController = { updateCompany, toggleFeaturedCompany, getSingleById, getMyCompany, getAllCompanies };
