import express from 'express';
import { CommentController } from './comment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { CommentValidations } from './comment.validation';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.USER, USER_ROLES.OWNER),
  validateRequest(CommentValidations.createCommentZodSchema),
  CommentController.createComment
); 

export const CommentRoutes = router;
