import express from 'express';
import { ReportController } from './report.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { ReportValidations } from './report.validation';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.USER, USER_ROLES.OWNER),
  validateRequest(ReportValidations.createReportZodSchema),
  ReportController.createReport
); 

export const ReportRoutes = router;
