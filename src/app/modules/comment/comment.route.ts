import express from 'express';
import { CommentController } from './comment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { CommentValidations } from './comment.validation';

const router = express.Router();

// create comment
router.post(
  '/create',
  auth(USER_ROLES.USER, USER_ROLES.OWNER),
  validateRequest(CommentValidations.createCommentZodSchema),
  CommentController.createComment
); 

// update comment
router.patch(
  '/:id',
  auth(USER_ROLES.USER, USER_ROLES.OWNER),
  validateRequest(CommentValidations.updateCommentZodSchema),
  CommentController.updateComment
);

// get comments by review id
router.get(
  '/review/:id',
  CommentController.getCommentsByReviewId
);

export const CommentRoutes = router;
