import express from 'express';
import { ReportController } from './report.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { ReportValidations } from './report.validation';

const router = express.Router();

// create report
router.post(
  '/create',
  auth(USER_ROLES.USER, USER_ROLES.OWNER),
  validateRequest(ReportValidations.createReportZodSchema),
  ReportController.createReport
); 

// update report
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(ReportValidations.updateReportZodSchema),
  ReportController.updateReport
);

// get all reports
router.get('/', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), ReportController.getAllReports);

export const ReportRoutes = router;
