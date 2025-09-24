import express from 'express';
import { RecentCompaniesController } from './recent-companies.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { RecentCompaniesValidations } from './recent-companies.validation';
import { USER_ROLES } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.USER, USER_ROLES.OWNER),
  validateRequest(RecentCompaniesValidations.createRecentCompaniesZodSchema),
  RecentCompaniesController.createRecentCompanies
);

// get user recent companies
router.get(
  '/',
  auth(USER_ROLES.USER, USER_ROLES.OWNER),
  RecentCompaniesController.getUserRecentCompanies
);

export const RecentCompaniesRoutes = router;
