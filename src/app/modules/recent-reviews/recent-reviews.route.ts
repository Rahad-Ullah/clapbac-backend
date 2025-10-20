import express from 'express';
import { RecentReviewsController } from './recent-reviews.controller';
import validateRequest from '../../middlewares/validateRequest';
import { RecentReviewsValidations } from './recent-reviews.validation';
import { USER_ROLES } from '../user/user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.USER, USER_ROLES.OWNER),
  validateRequest(RecentReviewsValidations.createRecentReviewsZodSchema),
  RecentReviewsController.createRecentReviews
);

export const RecentReviewsRoutes = router;
