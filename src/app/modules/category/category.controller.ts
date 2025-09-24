import { Request, Response, NextFunction } from 'express';
import { CategoryServices } from './category.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { getSingleFilePath } from '../../../shared/getFilePath';

// create category controller
const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const icon = getSingleFilePath(req.files, 'image');

    const result = await CategoryServices.createCategoryToDB({
      ...req.body,
      icon,
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Category created successfully',
      data: result,
    });
  }
);

// update category controller
const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const icon = getSingleFilePath(req.files, 'image');

    const result = await CategoryServices.updateCategoryToDB(id, {
      ...req.body,
      icon,
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Category updated successfully',
      data: result,
    });
  }
);

// get single category controller
const getSingleCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await CategoryServices.getSingleCategoryById(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Category retrieved successfully',
      data: result,
    });
  }
);

// get all categories controller
const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await CategoryServices.getAllCategories(req.query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Categories retrieved successfully',
      data: result,
    });
  }
);

export const CategoryController = {
  createCategory,
  updateCategory,
  getSingleCategory,
  getAllCategories,
};
