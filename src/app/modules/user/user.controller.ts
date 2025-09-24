import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';

const createOwner = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...userData } = req.body;
    const result = await UserService.createOwnerToDB(userData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message:
        'Account created successfully. Please check your email to verify.',
      data: result,
    });
  }
);

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getUserProfileFromDB(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data retrieved successfully',
    data: result,
  });
});

//update profile
const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    let image = getSingleFilePath(req.files, 'image');

    const data = {
      image,
      ...req.body,
    };
    const result = await UserService.updateProfileToDB(user, data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile updated successfully',
      data: result,
    });
  }
);

// get all users
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsersFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Users retrieved successfully',
    data: result.users,
    pagination: result.pagination,
  });
});

export const UserController = { createOwner, getUserProfile, updateProfile, getAllUsers };
