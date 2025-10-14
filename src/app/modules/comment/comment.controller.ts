import { Request, Response, NextFunction } from 'express';
import { CommentServices } from './comment.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

// create comment
const createComment = catchAsync(async (req: Request, res: Response) => {
  const result = await CommentServices.createCommentIntoDB({
    ...req.body,
    user: req.user.id,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Comment created successfully',
    data: result,
  });
});

export const CommentController = { createComment };
