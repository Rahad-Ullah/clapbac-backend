import express from 'express';
import { ReviewController } from './review.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewValidations } from './review.validation';

const router = express.Router();

// create review
router.post(
  '/create',
  auth(USER_ROLES.OWNER),
  validateRequest(ReviewValidations.createReviewZodSchema),
  ReviewController.createReview
);

// update review
router.patch(
  '/:id',
  auth(USER_ROLES.OWNER),
  validateRequest(ReviewValidations.updateReviewZodSchema),
  ReviewController.updateReview
);

export const ReviewRoutes = router;
