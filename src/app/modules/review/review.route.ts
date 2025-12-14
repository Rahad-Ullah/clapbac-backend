import express from 'express';
import { ReviewController } from './review.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewValidations } from './review.validation';

const router = express.Router();

// extract review info by ai
router.post(
  '/extract',
  auth(USER_ROLES.OWNER),
  validateRequest(ReviewValidations.extractReviewZodSchema),
  ReviewController.extractReviewByAi
);

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

// get all reviews
router.get(
  '/',
  ReviewController.getAllReviews
);

// get review by company id
router.get(
  '/company/:id',
  ReviewController.getReviewByCompanyId
);

// get all reviewers
router.get(
  '/reviewers',
  ReviewController.getAllReviewers
);

export const ReviewRoutes = router;
